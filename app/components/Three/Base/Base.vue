<template>
    <canvas
        ref="canvas"
        id="glcanvas"
        aria-hidden="true"
        aria-label="Animazione WebGL con forme bokeh su sfondo gradiente arancio"
        role="img"
    />
</template>

<script lang="ts" setup>

    // Third party
    import * as THREE from 'three';
    import { Pane } from 'tweakpane';

    const referenceCanvas = useTemplateRef<HTMLCanvasElement>( 'canvas' )
          , bgString = '/webgl/orange-gradient.webp'
          , noiseString = '/webgl/LDR_RG01_0.webp'
    ;

    onMounted(
        () => {

            if( ! referenceCanvas.value )
                return;

            /*
   * ============================================================
   *  BOKEH WEBGL EFFECT — Three.js Recreation
   *  Basato su microsoft.ai (Unicorn Studio / "Beam v3.2.0")
   *
   *  Pipeline dei render pass (ping-pong su WebGLRenderTarget):
   *
   *   1. VIGNETTE  — crea la forma radiale (centro trasparente,
   *                  bordi opachi viola scuro #4a0035).
   *                  Il centro segue il mouse con smooth lerp.
   *
   *   2. SINE      — deforma gli UV con onde sinusoidali.
   *
   *   3. SHATTER   — celle Voronoi animate + skew elevato → forme
   *                  allungate (le "foglie").
   *
   *   4. BOKEH     — blur spirale golden-angle, 50 sample,
   *                  dithered con blue-noise → blob morbidi.
   *
   *   5. OUTPUT    — compositing finale: sfondo orange-gradient.webp
   *                  × overlay × multiply col risultato bokeh.
   *
   *  Tutti i valori numerici sono estratti dal codice sorgente
   *  originale (minificato) di microsoft.ai.
   * ============================================================
   */

            // ──────────────────────────────────────────────────────────────
            //  0. CONFIGURAZIONE  (estratta da "Ui" nel sorgente originale)
            // ──────────────────────────────────────────────────────────────

            const RESOLUTION_SCALE = 0.5 // render a metà risoluzione

                  , CFG = {
                      background: { color: '#FFAAA5' },

                      vignette: {
                          color: '#4a0035', // colore del bordo scuro
                          radius: 0.354,
                          falloff: 1,
                          displace: 0,
                          mix: 1,
                          angle: 0,
                          skew: 0.54,
                          positionX: 0.603, // centro X iniziale (normalizzato 0-1)
                          positionY: 0.38, // centro Y iniziale (normalizzato 0-1, Y verso l'alto)
                      },

                      sine: {
                          frequency: 0.35,
                          amplitude: 1.18,
                          rotation: 0,
                          mixRadius: 1, // 1.0 = effetto su tutto lo schermo
                          trackMouse: 0,
                      },

                      shatter: {
                          scale: 0.534, // dimensione celle Voronoi
                          amount: 1, // intensità displacement
                          angle: 44, // gradi di rotazione celle
                          skew: 0.84, // allunga le celle (→ forme leaf-like)
                          mixRadius: 1,
                          mixRadiusInvert: 0,
                      },

                      bokeh: {
                          radius: 0.754, // raggio del blur
                          tilt: 0.5, // 0 = focus al centro, 1 = focus ai bordi
                          trackMouse: 0,
                          mixRadius: 1,
                      },

                      output: { color: '#FFD198' }, // tinta giallo-ambra del composite

                      blueNoiseResolution: [ 256, 256 ],
                  }

                  // ──────────────────────────────────────────────────────────────
                  //  1. UTILITY
                  // ──────────────────────────────────────────────────────────────

                  /**
                   * Converte hex '#RRGGBB' → array [r, g, b] normalizzato 0-1
                   * @param hex
                   */
                  , hexToRgb = ( hex: string ) => {

                      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

                      return m
                          ? [
                              m[ 1 ] ? Number.parseInt( m[ 1 ], 16 ) / 255 : 0,
                              m[ 2 ] ? Number.parseInt( m[ 2 ], 16 ) / 255 : 0,
                              m[ 3 ] ? Number.parseInt( m[ 3 ], 16 ) / 255 : 0,
                          ]
                          : [
                              0,
                              0,
                              0,
                          ];

                  }

                  // ──────────────────────────────────────────────────────────────
                  //  2. GLSL SHADERS
                  //     Adattati da #version 300 es → GLSL 1 (WebGL1-compatible,
                  //     funziona anche su Three.js r128 senza modifiche al core).
                  // ──────────────────────────────────────────────────────────────

                  // Vertex shader condiviso da tutti i full-screen quad pass
                  , VERT_SHARED = /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

                  // ── 2a. Vignette ─────────────────────────────────────────────
                  //
                  //  Output: radiale da (uClearColor, alpha=0) al centro
                  //                    a (uVignetteColor, alpha=1) ai bordi.
                  //  uPos è aggiornato ogni frame con la posizione del mouse
                  //  interpolata → il centro trasparente segue il cursore.
                  , FRAG_VIGNETTE = /* glsl */`
    #define TWO_PI 6.28318530718

    varying vec2 vUv;

    uniform float     uRadius;
    uniform float     uFalloff;
    uniform float     uDisplace;
    uniform float     uSkew;
    uniform float     uAngle;
    uniform vec3      uVignetteColor;
    uniform vec2      uPos;
    uniform vec2      uResolution;
    uniform vec3      uClearColor;

    mat2 rot(float a) {
      return mat2(cos(a), -sin(a), sin(a), cos(a));
    }

    void main() {
      vec2 uv          = vUv;
      vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 skew        = vec2(uSkew, 1.0 - uSkew);

      float halfRadius = uRadius * 0.5;
      float innerEdge  = halfRadius - uFalloff * halfRadius * 0.5;
      float outerEdge  = halfRadius + uFalloff * halfRadius * 0.5;

      vec2 scaledUV  = uv        * aspectRatio * rot(uAngle * TWO_PI) * skew;
      vec2 scaledPos = uPos      * aspectRatio * rot(uAngle * TWO_PI) * skew;

      float radius  = distance(scaledUV, scaledPos);
      float falloff = smoothstep(innerEdge, outerEdge, radius);

      // alpha: 0 al centro (trasparente), 1 ai bordi (opaco viola)
      gl_FragColor = mix(
        vec4(uClearColor,    0.0),
        vec4(uVignetteColor, 1.0),
        falloff
      );
    }
  `

                  // ── 2b. Sine Wave Distortion ──────────────────────────────────
                  //
                  //  Deforma gli UV della texture con due onde sinusoidali
                  //  (una in X, una in Y) animate nel tempo.
                  //  Con mixRadius=1 l'effetto copre tutto lo schermo.
                  , FRAG_SINE = /* glsl */`
    #define PI  3.141592
    #define PI3 1.04709283144

    varying vec2 vUv;

    uniform sampler2D tInput;
    uniform float     uMixRadius;
    uniform vec2      uPos;
    uniform float     uFrequency;
    uniform float     uAmplitude;
    uniform float     uRotation;
    uniform float     uTime;
    uniform vec2      uResolution;
    uniform vec2      uMousePos;
    uniform float     uTrackMouse;

    void main() {
      vec2 uv        = vUv;
      vec2 waveCoord = vUv * 2.0 - 1.0;

      float time      = uTime * 0.25;
      float frequency = 20.0 * uFrequency;
      float amp       = uAmplitude * 0.2;

      float waveX = sin((waveCoord.y + uPos.y) * frequency + (time * PI3)) * amp;
      float waveY = sin((waveCoord.x - uPos.x) * frequency + (time * PI3)) * amp;

      waveCoord += vec2(mix(waveX, 0.0, uRotation), mix(0.0, waveY, uRotation));

      vec2  finalUV     = waveCoord * 0.5 + 0.5;
      float aspectRatio = uResolution.x / uResolution.y;

      // mPos = centro effetto (mouse-tracked se trackMouse>0)
      vec2 mPos = uPos + mix(vec2(0.0), (uMousePos - 0.5), uTrackMouse);

      // dist: con mixRadius=1 → (1 - mixRadius)=0 → dist=1 ovunque
      // → effetto uniforme su tutto lo schermo
      float dist = max(0.0,
        1.0 - distance(
          uv  * vec2(aspectRatio, 1.0),
          mPos * vec2(aspectRatio, 1.0)
        ) * 4.0 * (1.0 - uMixRadius)
      );

      uv = mix(uv, finalUV, dist);
      gl_FragColor = texture2D(tInput, uv);
    }
  `

                  // ── 2c. Shatter (Voronoi Displacement) ───────────────────────
                  //
                  //  Griglia Voronoi 3×3 con offset random animati nel tempo.
                  //  Lo skew elevato (0.84) allunga le celle orizzontalmente
                  //  → dopo il bokeh blur diventano le "foglie" che vediamo.
                  , FRAG_SHATTER = /* glsl */`
    #define PI 3.14159265359

    varying vec2 vUv;

    uniform sampler2D tInput;
    uniform float     uAmount;
    uniform float     uSpread;
    uniform float     uAngle;
    uniform float     uTime;
    uniform float     uSkew;
    uniform vec2      uPos;
    uniform vec2      uResolution;
    uniform float     uMixRadius;
    uniform vec2      uMousePos;
    uniform float     uTrackMouse;

    // Hash pseudo-random per Voronoi
    vec2 random2(vec2 p) {
      return fract(
        sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))))
        * 43758.5453
      );
    }

    mat2 rot(float a) {
      return mat2(cos(a), -sin(a), sin(a), cos(a));
    }

    void main() {
      vec2  uv          = vUv;
      float aspectRatio = uResolution.x / uResolution.y;

      // Skew: mix(vec2(1), vec2(1,0), skew) → allunga in Y
      vec2 skew = mix(vec2(1.0), vec2(1.0, 0.0), uSkew);

      // Trasforma lo spazio Voronoi
      vec2 st = (uv - uPos) * vec2(aspectRatio, 1.0) * 50.0 * uAmount;
      st = st * rot(uAngle * 2.0 * PI) * skew;

      vec2  i_st   = floor(st);
      vec2  f_st   = fract(st);
      float m_dist = 15.0;
      vec2  m_point;

      // Cerca il punto Voronoi più vicino nei 9 vicini
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 neighbor = vec2(float(i), float(j));
          // Posizione del punto nella cella, animata nel tempo
          vec2 point = random2(i_st + neighbor);
          point = 0.5 + 0.5 * sin(5.0 + uTime * 0.2 + 6.2831 * point);
          vec2  diff = neighbor + point - f_st;
          float dist = length(diff);
          if (dist < m_dist) { m_dist = dist; m_point = point; }
        }
      }

      // Offset UV basato sul punto più vicino
      vec2 offset = (m_point * 0.2 * uSpread * 2.0) - (uSpread * 0.2);

      vec2  mPos = uPos + mix(vec2(0.0), (uMousePos - 0.5), uTrackMouse);
      float dist = max(0.0,
        1.0 - distance(
          uv   * vec2(aspectRatio, 1.0),
          mPos * vec2(aspectRatio, 1.0)
        ) * 4.0 * (1.0 - uMixRadius)
      );

      gl_FragColor = texture2D(tInput, uv + offset * dist);
    }
  `

                  // ── 2d. Fast Bokeh Blur ───────────────────────────────────────
                  //
                  //  Blur a spirale con angolo d'oro (golden angle 2.39996323 rad)
                  //  per distribuzione uniforme dei sample senza banding.
                  //  Blue noise dithering → evita pattern di aliasing nel blur.
                  //  50 iterazioni (ITERATIONS) × golden angle = copertura ~uniforme
                  //  del disco.
                  //
                  //  Il peso per ogni sample (bokehWeight) enfatizza le aree chiare:
                  //    w = 5 + pow(color, 9) * 150
                  //  → le zone luminose contribuiscono molto di più → "halo" bokeh.
                  , FRAG_BOKEH = /* glsl */`
    #define PI          3.14159265
    #define PI2         6.28318530718
    #define ITERATIONS  50.0
    #define GOLDEN_ANGLE 2.39996323   // 2π / φ² ≈ 137.5°

    varying vec2 vUv;

    uniform sampler2D tInput;
    uniform sampler2D tBlueNoise;
    uniform float     uAmount;
    uniform float     uTilt;
    uniform float     uTime;
    uniform vec2      uPos;
    uniform vec2      uResolution;
    uniform vec2      uMousePos;
    uniform float     uTrackMouse;
    uniform vec2      uBlueNoiseResolution;

    // Campionamento a spirale: r cresce di 1/r ad ogni passo
    // → distribuzione quasi-uniforme nel disco di raggio max
    vec2 sampleSpiral(in float theta, inout float r) {
      r += 1.0 / r;
      return (r - 1.0) * vec2(cos(theta), sin(theta));
    }

    // Legge il blue-noise (texture 256×256, repeat) e restituisce
    // un angolo casuale per ruotare il pattern di sample → elimina
    // il banding visibile senza blue-noise.
    float getBlueNoiseOffset(vec2 st) {
      vec2 texSize  = uBlueNoiseResolution;
      vec2 noiseUV  = fract(
        st * (uResolution / texSize) * vec2(texSize.x / texSize.y, 1.0)
      );
      vec4 blueNoise = texture2D(tBlueNoise, noiseUV);
      return mod((blueNoise.r - 0.5) * PI2, PI2);
    }

    vec4 Bokeh(sampler2D tex, vec2 uv, float blurRadius) {
      vec3  accColor   = vec3(0.0);
      vec3  accWeights = vec3(0.0);
      float accAlpha   = 0.0;

      float aspectRatio = uResolution.x / uResolution.y;
      // pixelSize: dimensione fisica del blur in UV-space
      vec2 pixelSize = vec2(1.0 / aspectRatio, 1.0) * 0.04 * 0.075;

      float r = 1.0; // raggio spirale (viene incrementato dentro il loop)

      float noiseOffset = (getBlueNoiseOffset(uv) - 0.5) * 0.01;
      float noiseAngle  = noiseOffset * PI2;
      float c = cos(noiseAngle), s = sin(noiseAngle);
      mat2 rotMat = mat2(c, -s, s, c); // rotazione random del pattern

      for (float j = 0.0; j < GOLDEN_ANGLE * ITERATIONS; j += GOLDEN_ANGLE) {
        vec2  offset  = sampleSpiral(j, r) * pixelSize;
        // Jitter leggero per spezzare il pattern regolare
        float jitter  = 0.05 * (sin(j * 0.1) * 0.5 + 0.5);
        offset *= 1.0 + jitter * sin(j * 0.7 + noiseOffset);

        vec2  sampleOff = rotMat * offset;
        vec4  col       = texture2D(tex, uv + sampleOff);

        // Peso che enfatizza pixel luminosi → "firefly" bokeh highlight
        vec3 w = vec3(5.0) + pow(col.rgb, vec3(9.0)) * 150.0;

        accAlpha   += col.a;
        accColor   += col.rgb * w;
        accWeights += w;
      }

      return vec4(accColor / accWeights, accAlpha / ITERATIONS);
    }

    void main() {
      if (uAmount == 0.0) { gl_FragColor = vec4(0.0); return; }

      vec2  pos = uPos + mix(vec2(0.0), (uMousePos - 0.5), uTrackMouse);
      float dis = distance(vUv, pos) * 1000.0;

      // tilt=0.5: raggio uniforme ovunque (mix equo tra near/far focus)
      float tilt       = mix(1.0 - dis * 0.001, dis * 0.001, uTilt);
      float blurRadius = uAmount * tilt;

      gl_FragColor = Bokeh(tInput, vUv, blurRadius);
    }
  `

                  // ── 2e. Output Composite ──────────────────────────────────────
                  //
                  //  Compositing finale:
                  //    base   = mix(bgColor, overlay(bgColor, bgTexture), 0.61)
                  //             → orange-gradient.webp mescolata con il colore piatto
                  //    blend  = mix(outputColor, bokehResult.rgb, bokehResult.a)
                  //             → il risultato bokeh è sovrapposto con il colore di output
                  //    final  = base * mix(1, blend, 0.26)
                  //             → moltiplicazione leggera (0.26) del bokeh sulla base
                  //
                  //  Il colore di fallback (197/136/122) viene mostrato mentre
                  //  le texture si caricano.
                  , FRAG_OUTPUT = /* glsl */`
    varying vec2 vUv;

    uniform sampler2D tBgTexture;   // orange-gradient.webp
    uniform sampler2D tInput;       // risultato del bokeh pass
    uniform vec3      uBgColor;     // #FFAAA5
    uniform vec3      uOutputColor; // #FFD198
    uniform int       uLoaded;      // 0 finché le texture non sono pronte

    // Overlay blend mode (Photoshop-style)
    vec3 overlay(vec3 base, vec3 blend) {
      return mix(
        2.0 * base * blend,
        1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
        step(0.5, base)
      );
    }

    void main() {
      // Fallback prima che le texture siano caricate
      if (uLoaded == 0) {
        gl_FragColor = vec4(197.0/255.0, 136.0/255.0, 122.0/255.0, 1.0);
        return;
      }

      // Base: sfondo flat + overlay con la texture gradiente
      vec3 bgTex = texture2D(tBgTexture, vUv).rgb;
      vec3 base  = mix(uBgColor, overlay(uBgColor, bgTex), 0.61);

      // Bokeh result: alpha dice quanta luce bokeh c'è
      vec4 bokehResult = texture2D(tInput, vUv);
      vec3 blend       = mix(uOutputColor, bokehResult.rgb, bokehResult.a);

      // Multiply leggero (0.26) del bokeh sulla base
      gl_FragColor.rgb = base * mix(vec3(1.0), blend, 0.26);
      gl_FragColor.a   = 1.0;
    }
  `

                  // ──────────────────────────────────────────────────────────────
                  //  3. THREE.JS SETUP
                  // ──────────────────────────────────────────────────────────────

                  , canvas = referenceCanvas.value;

            let W = Math.floor( window.innerWidth * RESOLUTION_SCALE )
                , H = Math.floor( window.innerHeight * RESOLUTION_SCALE );

            const renderer = new THREE.WebGLRenderer( {
                canvas,
                antialias: false, // nessun AA: è un blur effect, non serve
                alpha: false,
                powerPreference: 'high-performance',
            } );

            renderer.setPixelRatio( 1 ); // gestiamo noi il pixel ratio tramite RESOLUTION_SCALE
            renderer.autoClear = false; // puliamo manualmente ogni pass
            renderer.setSize( W, H, false ); // "false" = non impostare lo stile CSS; lo fa il CSS sopra

            // Camera ortografica che inquadra esattamente il quad 1×1
            // left=-0.5, right=0.5, top=0.5, bottom=-0.5 → perfetto per PlaneGeometry(1,1)
            const camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0.1, 10 );

            camera.position.z = 1;

            // Scena con un singolo quad — cambiamo il material ad ogni pass
            const scene = new THREE.Scene()
                  , quad = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ) )
            ;

            scene.add( quad );

            // Render Targets (ping-pong read/write)
            const rtOptions = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                // NB: non usiamo HalfFloat qui per massima compatibilità.
                // Il sorgente originale usa HALF_FLOAT per qualità colore superiore.
                type: THREE.HalfFloatType,
                depthBuffer: false,
                stencilBuffer: false,
            };

            let bufferRead = new THREE.WebGLRenderTarget( W, H, rtOptions )
                , bufferWrite = new THREE.WebGLRenderTarget( W, H, rtOptions );

            // Helper: swap ping-pong buffers
            /**
             *
             */
            function swapBuffers() {

                const temporary = bufferRead;

                bufferRead = bufferWrite;
                bufferWrite = temporary;

            }

            // ──────────────────────────────────────────────────────────────
            //  4. MATERIALS (uno per pass)
            // ──────────────────────────────────────────────────────────────

            const bgColor = hexToRgb( CFG.background.color )
                  , vigColor = hexToRgb( CFG.vignette.color )
                  , outputColor = hexToRgb( CFG.output.color )

                  // Tutti i material condividono:
                  //   depthTest: false  → non serve depth su fullscreen quads
                  //   depthWrite: false → idem
                  , MAT_BASE = {
                      depthTest: false,
                      depthWrite: false,
                  }

                  // ── 4a. Vignette ──
                  //
                  //  IMPORTANTE: transparent: false (default).
                  //  Con transparent:true Three.js abilita il GL alpha-blending,
                  //  il che azzererebbe i canali RGB dove alpha=0 (il centro).
                  //  Vogliamo invece scrivere i valori RGB corretti anche con alpha=0
                  //  (es. il centro scrive (bgColor, 0.0) non (0,0,0,0))
                  //  perché il bokeh pass campiona quei colori e usa l'alpha separatamente.
                  , vignetteMat = new THREE.ShaderMaterial( {
                      ... MAT_BASE,
                      vertexShader: VERT_SHARED,
                      fragmentShader: FRAG_VIGNETTE,
                      transparent: false, // scrive RGBA direttamente senza alpha-blending
                      uniforms: {
                          uRadius: { value: CFG.vignette.radius },
                          uFalloff: { value: CFG.vignette.falloff },
                          uDisplace: { value: CFG.vignette.displace },
                          uSkew: { value: CFG.vignette.skew },
                          uAngle: { value: CFG.vignette.angle },
                          uVignetteColor: { value: new THREE.Vector3( ... vigColor ) },
                          uPos: { value: new THREE.Vector2( CFG.vignette.positionX, CFG.vignette.positionY ) },
                          uResolution: { value: new THREE.Vector2( W, H ) },
                          uClearColor: { value: new THREE.Vector3( ... bgColor ) },
                      },
                  } )

                  // ── 4b. Sine ──
                  , sineMat = new THREE.ShaderMaterial( {
                      ... MAT_BASE,
                      vertexShader: VERT_SHARED,
                      fragmentShader: FRAG_SINE,
                      uniforms: {
                          tInput: { value: null },
                          uMixRadius: { value: CFG.sine.mixRadius },
                          uPos: { value: new THREE.Vector2( 0.5, 0.5 ) },
                          uFrequency: { value: CFG.sine.frequency },
                          uAmplitude: { value: CFG.sine.amplitude },
                          uRotation: { value: CFG.sine.rotation },
                          uTime: { value: 0 },
                          uResolution: { value: new THREE.Vector2( W, H ) },
                          uMousePos: { value: new THREE.Vector2( 0.5, 0.5 ) },
                          uTrackMouse: { value: CFG.sine.trackMouse },
                      },
                  } )

                  // ── 4c. Shatter ──
                  , shatterMat = new THREE.ShaderMaterial( {
                      ... MAT_BASE,
                      vertexShader: VERT_SHARED,
                      fragmentShader: FRAG_SHATTER,
                      uniforms: {
                          tInput: { value: null },
                          uAmount: { value: CFG.shatter.scale },
                          uSpread: { value: CFG.shatter.amount },
                          uAngle: { value: CFG.shatter.angle / 360 }, // normalizzato come nel sorgente
                          uTime: { value: 0 },
                          uSkew: { value: CFG.shatter.skew },
                          uPos: { value: new THREE.Vector2( 0.5, 0.5 ) },
                          uResolution: { value: new THREE.Vector2( W, H ) },
                          uMixRadius: { value: CFG.shatter.mixRadius },
                          uMousePos: { value: new THREE.Vector2( 0.5, 0.5 ) },
                          uTrackMouse: { value: 0 },
                      },
                  } )

                  // ── 4d. Bokeh ──
                  , bokehMat = new THREE.ShaderMaterial( {
                      ... MAT_BASE,
                      vertexShader: VERT_SHARED,
                      fragmentShader: FRAG_BOKEH,
                      uniforms: {
                          tInput: { value: null },
                          tBlueNoise: { value: null }, // caricata async
                          uAmount: { value: CFG.bokeh.radius },
                          uTilt: { value: CFG.bokeh.tilt },
                          uTime: { value: 0 },
                          uPos: { value: new THREE.Vector2( 0.5, 0.5 ) },
                          uResolution: { value: new THREE.Vector2( W, H ) },
                          uMousePos: { value: new THREE.Vector2( 0.5, 0.5 ) },
                          uTrackMouse: { value: CFG.bokeh.trackMouse },
                          uBlueNoiseResolution: { value: new THREE.Vector2( ... CFG.blueNoiseResolution ) },
                      },
                  } )

                  // ── 4e. Output ──
                  , outputMat = new THREE.ShaderMaterial( {
                      ... MAT_BASE,
                      vertexShader: VERT_SHARED,
                      fragmentShader: FRAG_OUTPUT,
                      uniforms: {
                          tBgTexture: { value: null }, // orange-gradient.webp caricato async
                          tInput: { value: null },
                          uBgColor: { value: new THREE.Vector3( ... bgColor ) },
                          uOutputColor: { value: new THREE.Vector3( ... outputColor ) },
                          uLoaded: { value: 0 }, // diventa 1 quando entrambe le texture sono pronte
                      },
                  } );

            // ──────────────────────────────────────────────────────────────
            //  5. CARICAMENTO TEXTURE
            //     I file devono trovarsi nella stessa directory dell'HTML.
            //     In alternativa, passa i path assoluti / CDN.
            // ──────────────────────────────────────────────────────────────

            let loadedCount = 0;

            /**
             *
             */
            function onTextureLoaded() {

                loadedCount ++;
                // Solo quando entrambe le texture sono pronte attiviamo il composite
                if( loadedCount >= 2 && outputMat.uniforms.uLoaded )
                    outputMat.uniforms.uLoaded.value = 1;

            }

            const textureLoader = new THREE.TextureLoader();

            // Background gradient (orange-gradient.webp)
            textureLoader.load(
                bgString,
                tex => {

                    tex.wrapS = THREE.RepeatWrapping;
                    tex.wrapT = THREE.RepeatWrapping;
                    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    if( outputMat.uniforms.tBgTexture )
                        outputMat.uniforms.tBgTexture.value = tex;
                    onTextureLoaded();

                },
                undefined,
                error => {

                    // Se il file non si trova, mostriamo comunque qualcosa
                    console.warn( '[bokeh] Errore caricamento background texture:', error );
                    onTextureLoaded(); // conta comunque per non bloccare l'effetto

                }
            );

            // Blue noise (LDR_RG01_0.webp)
            textureLoader.load(
                noiseString,
                tex => {

                    tex.wrapS = THREE.RepeatWrapping;
                    tex.wrapT = THREE.RepeatWrapping;
                    if( bokehMat.uniforms.tBlueNoise )
                        bokehMat.uniforms.tBlueNoise.value = tex;
                    onTextureLoaded();

                },
                undefined,
                error => {

                    console.warn( '[bokeh] Errore caricamento blue-noise texture:', error );
                    onTextureLoaded();

                }
            );

            // ──────────────────────────────────────────────────────────────
            //  6. MOUSE TRACKING
            //     Il puntatore viene normalizzato 0-1 con Y invertito
            //     (come nel sorgente originale: 1 - clientY/height).
            //     currMouse è l'interpolazione smooth (lerp 10%) verso mouse.
            // ──────────────────────────────────────────────────────────────

            const mouse = new THREE.Vector2( CFG.vignette.positionX, CFG.vignette.positionY )
                  , currentMouse = new THREE.Vector2( CFG.vignette.positionX, CFG.vignette.positionY )
            ;

            globalThis.addEventListener(
                'pointermove',
                ( event: MouseEvent ) => {

                    const rect = canvas.getBoundingClientRect();

                    mouse.x = ( event.clientX - rect.left ) / rect.width;
                    mouse.y = 1 - ( ( event.clientY - rect.top ) / rect.height ); // Y flip!

                }
            );

            // Touch support
            globalThis.addEventListener(
                'touchmove',
                ( event: TouchEvent ) => {

                    const touch = event.touches[ 0 ]
                          , rect = canvas.getBoundingClientRect();

                    if( ! touch )
                        return;
                    mouse.x = ( touch.clientX - rect.left ) / rect.width;
                    mouse.y = 1 - ( ( touch.clientY - rect.top ) / rect.height );

                },
                { passive: true }
            );

            // ──────────────────────────────────────────────────────────────
            //  7. RESIZE HANDLER
            // ──────────────────────────────────────────────────────────────

            window.addEventListener(
                'resize',
                () => {

                    W = Math.floor( window.innerWidth * RESOLUTION_SCALE );
                    H = Math.floor( window.innerHeight * RESOLUTION_SCALE );

                    renderer.setSize( W, H, false );

                    bufferRead.setSize( W, H );
                    bufferWrite.setSize( W, H );

                    // Aggiorna uResolution in tutti i material che lo usano
                    for(
                        const mat of[
vignetteMat,
sineMat,
shatterMat,
bokehMat,
                ]
                    ) {

                        if( mat.uniforms.uResolution )
                            mat.uniforms.uResolution.value.set( W, H );

                    }

                }
            );

            // ──────────────────────────────────────────────────────────────
            //  8. HELPER: renderPass(material, renderTarget|null)
            //     Imposta il material sul quad, pulisce il target, renderizza.
            //     Se target è null, renderizza su schermo.
            // ──────────────────────────────────────────────────────────────

            const renderPass = ( mat: THREE.Material, target: THREE.WebGLRenderTarget | null ) => {

                quad.material = mat;
                renderer.setRenderTarget( target ); // null = screen
                renderer.setClearColor( 0x00_00_00, 0 ); // trasparente
                renderer.clear();
                renderer.render( scene, camera );

            };

            // ──────────────────────────────────────────────────────────────
            //  9. ANIMATION LOOP
            // ──────────────────────────────────────────────────────────────

            let elapsed = 0
                , lastTime = performance.now(); // eslint-disable-line compat/compat

            const animate = ( now: number ) => {

                requestAnimationFrame( animate ); // eslint-disable-line compat/compat

                // Delta time in secondi, moltiplicato per 2 come nel sorgente
                const dt = ( now - lastTime ) / 1000;

                lastTime = now;
                elapsed += dt * 2;

                // ── Smooth mouse lerp (fattore 0.1 = 10% per frame, come nel sorgente)
                currentMouse.x += ( mouse.x - currentMouse.x ) * 0.1;
                currentMouse.y += ( mouse.y - currentMouse.y ) * 0.1;

                // ── PASS 1: Vignette ──────────────────────────────────────
                // Il centro della vignette (uPos) segue il mouse interpolato.
                // Alpha 0 al centro (trasparente), 1 ai bordi (viola scuro).
                if( vignetteMat.uniforms.uPos )
                    vignetteMat.uniforms.uPos.value.copy( currentMouse );

                renderPass( vignetteMat, bufferWrite );
                swapBuffers();

                // ── PASS 2: Sine Distortion ───────────────────────────────
                if( sineMat.uniforms.tInput )
                    sineMat.uniforms.tInput.value = bufferRead.texture;
                if( sineMat.uniforms.uTime )
                    sineMat.uniforms.uTime.value = elapsed;
                if( sineMat.uniforms.uMousePos )
                    sineMat.uniforms.uMousePos.value.copy( currentMouse );

                renderPass( sineMat, bufferWrite );
                swapBuffers();

                // ── PASS 3: Shatter / Voronoi ─────────────────────────────
                if( shatterMat.uniforms.tInput )
                    shatterMat.uniforms.tInput.value = bufferRead.texture;
                if( shatterMat.uniforms.uTime )
                    shatterMat.uniforms.uTime.value = elapsed;
                if( shatterMat.uniforms.uMousePos )
                    shatterMat.uniforms.uMousePos.value.copy( currentMouse );

                renderPass( shatterMat, bufferWrite );
                swapBuffers();

                // ── PASS 4: Bokeh Blur ────────────────────────────────────
                if( bokehMat.uniforms.tInput )
                    bokehMat.uniforms.tInput.value = bufferRead.texture;
                if( bokehMat.uniforms.uTime )
                    bokehMat.uniforms.uTime.value = elapsed;
                if( bokehMat.uniforms.uMousePos )
                    bokehMat.uniforms.uMousePos.value.copy( currentMouse );

                renderPass( bokehMat, bufferWrite );
                swapBuffers();

                // ── PASS 5: Output Composite → schermo ───────────────────
                // tBgTexture = orange-gradient.webp (o null se non ancora caricata)
                // tInput = risultato bokeh
                if( outputMat.uniforms.tInput )
                    outputMat.uniforms.tInput.value = bufferRead.texture;

                renderPass( outputMat, null ); // null = render su canvas/screen

            };

            requestAnimationFrame( animate ); // eslint-disable-line compat/compat

            // ──────────────────────────────────────────────────────────────
            //  10. TWEAKPANE — Live controls
            //
            //  PARAMS è l'oggetto che TweakPane legge/scrive.
            //  Ogni onChange aggiorna il corrispondente uniform Three.js.
            //
            //  IMPORTANTE: i colori sono stringhe hex '#RRGGBB'.
            //  Quando cambiano, chiamiamo hexToRgb() e aggiorniamo
            //  il THREE.Vector3 del uniform con .set(r, g, b).
            //
            //  Per gli scalari (float) aggiorniamo direttamente .value.
            //
            //  shatterMat.uniforms.uAngle riceve (gradi / 360) come nel
            //  sorgente originale, quindi la conversione è nel onChange.
            // ──────────────────────────────────────────────────────────────

            // Oggetto sorgente di verità per TweakPane
            const PARAMS = {
                      // Colors
                      bgColor: CFG.background.color, // '#FFAAA5'
                      vignetteColor: CFG.vignette.color, // '#4a0035'
                      outputColor: CFG.output.color, // '#FFD198'
                      // Vignette
                      vigRadius: CFG.vignette.radius, // 0.354
                      vigFalloff: CFG.vignette.falloff, // 1.0
                      vigSkew: CFG.vignette.skew, // 0.54
                      vigAngle: CFG.vignette.angle, // 0.0
                      // Sine
                      sineFreq: CFG.sine.frequency, // 0.35
                      sineAmp: CFG.sine.amplitude, // 1.18
                      sineRot: CFG.sine.rotation, // 0.0
                      // Shatter
                      shScale: CFG.shatter.scale, // 0.534
                      shAmount: CFG.shatter.amount, // 1.0
                      shAngle: CFG.shatter.angle, // 44 (gradi interi)
                      shSkew: CFG.shatter.skew, // 0.84
                      // Bokeh
                      bokRadius: CFG.bokeh.radius, // 0.754
                      bokTilt: CFG.bokeh.tilt, // 0.5
                  }

                  // Inizializza il pannello nel container che abbiamo creato nell'HTML
                  , pane = new Pane(
                      {
                          title: '⚙️ Controls',
                          expanded: true,
                      }
                  )

                  // ── Helper: aggiorna un uniform Vector3 da colore hex ──
                  , applyColor = ( uniform3?: THREE.IUniform, hex?: string ) => {

                      if( uniform3 && hex ) {

                          const rgb = hexToRgb( hex );

                          uniform3.value.set( rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] );

                      }

                  }

                  // ── Folder: Colors ────────────────────────────────────────────
                  , fColors = pane.addFolder(
                      {
                          title: 'Colors',
                          expanded: false,
                      }
                  );

            fColors
                .addBinding(
                    PARAMS,
                    'bgColor',
                    {
                        label: 'Background',
                        view: 'color',
                    }
                )
                .on(
                    'change',
                    event_ => {

                        // Background color aggiorna ENTRAMBI:
                        //   - vignetteMat.uClearColor  (RGB del centro trasparente)
                        //   - outputMat.uBgColor       (RGB nel composite finale)
                        applyColor( vignetteMat.uniforms.uClearColor, event_.value );
                        applyColor( outputMat.uniforms.uBgColor, event_.value );

                    }
                );

            fColors
                .addBinding(
                    PARAMS,
                    'vignetteColor',
                    {
                        label: 'Shapes / Vignette',
                        view: 'color',
                    }
                )
                .on(
                    'change',
                    event_ => {

                        applyColor( vignetteMat.uniforms.uVignetteColor, event_.value );

                    }
                );

            fColors
                .addBinding(
                    PARAMS,
                    'outputColor',
                    {
                        label: 'Output Tint',
                        view: 'color',
                    }
                )
                .on(
                    'change',
                    event_ => {

                        applyColor( outputMat.uniforms.uOutputColor, event_.value );

                    }
                );

            // ── Folder: Vignette ─────────────────────────────────────────
            const fVig = pane.addFolder(
                {
                    title: 'Vignette',
                    expanded: false,
                }
            );

            fVig
                .addBinding(
                    PARAMS,
                    'vigRadius',
                    {
                        label: 'Radius',
                        min: 0.01,
                        max: 1.5,
                        step: 0.001,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( vignetteMat.uniforms.uRadius )
                            vignetteMat.uniforms.uRadius.value = event_.value;

                    }
                );

            fVig
                .addBinding(
                    PARAMS,
                    'vigFalloff',
                    {
                        label: 'Falloff',
                        min: 0,
                        max: 3,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( vignetteMat.uniforms.uFalloff )
                            vignetteMat.uniforms.uFalloff.value = event_.value;

                    }
                );

            fVig
                .addBinding(
                    PARAMS,
                    'vigSkew',
                    {
                        label: 'Skew',
                        min: 0,
                        max: 1,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( vignetteMat.uniforms.uSkew )
                            vignetteMat.uniforms.uSkew.value = event_.value;

                    }
                );

            fVig
                .addBinding(
                    PARAMS,
                    'vigAngle',
                    {
                        label: 'Angle',
                        min: 0,
                        max: 1,
                        step: 0.001,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( vignetteMat.uniforms.uAngle )
                            vignetteMat.uniforms.uAngle.value = event_.value;

                    }
                );

            // ── Folder: Sine Distortion ───────────────────────────────────
            const fSine = pane.addFolder(
                {
                    title: 'Sine Distortion',
                    expanded: false,
                }
            );

            fSine
                .addBinding(
                    PARAMS,
                    'sineFreq',
                    {
                        label: 'Frequency',
                        min: 0,
                        max: 2,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( sineMat.uniforms.uFrequency )
                            sineMat.uniforms.uFrequency.value = event_.value;

                    }
                );

            fSine
                .addBinding(
                    PARAMS,
                    'sineAmp',
                    {
                        label: 'Amplitude',
                        min: 0,
                        max: 3,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( sineMat.uniforms.uAmplitude )
                            sineMat.uniforms.uAmplitude.value = event_.value;

                    }
                );

            fSine
                .addBinding(
                    PARAMS,
                    'sineRot',
                    {
                        label: 'Rotation',
                        min: 0,
                        max: 1,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( sineMat.uniforms.uRotation )
                            sineMat.uniforms.uRotation.value = event_.value;

                    }
                );

            // ── Folder: Shatter / Voronoi ─────────────────────────────────
            const fShatter = pane.addFolder(
                {
                    title: 'Shatter (Leaf Shapes)',
                    expanded: false,
                }
            );

            fShatter
                .addBinding(
                    PARAMS,
                    'shScale',
                    {
                        label: 'Cell Scale',
                        min: 0.05,
                        max: 2,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( shatterMat.uniforms.uAmount )
                            shatterMat.uniforms.uAmount.value = event_.value;

                    }
                );

            fShatter
                .addBinding(
                    PARAMS,
                    'shAmount',
                    {
                        label: 'Displacement',
                        min: 0,
                        max: 3,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( shatterMat.uniforms.uSpread )
                            shatterMat.uniforms.uSpread.value = event_.value;

                    }
                );

            fShatter
                .addBinding(
                    PARAMS,
                    'shAngle',
                    {
                        label: 'Angle (deg)',
                        min: 0,
                        max: 360,
                        step: 1,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( shatterMat.uniforms.uAngle )// uAngle nello shader è normalizzato 0-1 (gradi/360) come nel sorgente originale
                            shatterMat.uniforms.uAngle.value = event_.value / 360;

                    }
                );

            fShatter
                .addBinding(
                    PARAMS,
                    'shSkew',
                    {
                        label: 'Skew',
                        min: 0,
                        max: 1,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( shatterMat.uniforms.uSkew )
                            shatterMat.uniforms.uSkew.value = event_.value;

                    }
                );

            // ── Folder: Bokeh Blur ────────────────────────────────────────
            const fBokeh = pane.addFolder(
                {
                    title: 'Bokeh Blur',
                    expanded: false,
                }
            );

            fBokeh
                .addBinding(
                    PARAMS,
                    'bokRadius',
                    {
                        label: 'Blur Radius',
                        min: 0,
                        max: 2,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( bokehMat.uniforms.uAmount )
                            bokehMat.uniforms.uAmount.value = event_.value;

                    }
                );

            fBokeh
                .addBinding(
                    PARAMS,
                    'bokTilt',
                    {
                        label: 'Tilt / Focus',
                        min: 0,
                        max: 1,
                        step: 0.01,
                    }
                )
                .on(
                    'change',
                    event_ => {

                        if( bokehMat.uniforms.uTilt )
                            bokehMat.uniforms.uTilt.value = event_.value;

                    }
                );

            // ── Separator + Reset button ──────────────────────────────────
            pane.addBlade( { view: 'separator' } );

            pane.addButton( { title: '↺  Reset to Defaults' } ).on(
                'click',
                () => {

                    // 1. Riporta PARAMS ai valori CFG originali
                    PARAMS.bgColor = CFG.background.color;
                    PARAMS.vignetteColor = CFG.vignette.color;
                    PARAMS.outputColor = CFG.output.color;
                    PARAMS.vigRadius = CFG.vignette.radius;
                    PARAMS.vigFalloff = CFG.vignette.falloff;
                    PARAMS.vigSkew = CFG.vignette.skew;
                    PARAMS.vigAngle = CFG.vignette.angle;
                    PARAMS.sineFreq = CFG.sine.frequency;
                    PARAMS.sineAmp = CFG.sine.amplitude;
                    PARAMS.sineRot = CFG.sine.rotation;
                    PARAMS.shScale = CFG.shatter.scale;
                    PARAMS.shAmount = CFG.shatter.amount;
                    PARAMS.shAngle = CFG.shatter.angle;
                    PARAMS.shSkew = CFG.shatter.skew;
                    PARAMS.bokRadius = CFG.bokeh.radius;
                    PARAMS.bokTilt = CFG.bokeh.tilt;

                    // 2. Riapplica tutti gli uniform Three.js
                    applyColor( vignetteMat.uniforms.uClearColor, CFG.background.color );
                    applyColor( outputMat.uniforms.uBgColor, CFG.background.color );
                    applyColor( vignetteMat.uniforms.uVignetteColor, CFG.vignette.color );
                    applyColor( outputMat.uniforms.uOutputColor, CFG.output.color );

                    if( vignetteMat.uniforms.uRadius )
                        vignetteMat.uniforms.uRadius.value = CFG.vignette.radius;
                    if( vignetteMat.uniforms.uFalloff )
                        vignetteMat.uniforms.uFalloff.value = CFG.vignette.falloff;
                    if( vignetteMat.uniforms.uSkew )
                        vignetteMat.uniforms.uSkew.value = CFG.vignette.skew;
                    if( vignetteMat.uniforms.uAngle )
                        vignetteMat.uniforms.uAngle.value = CFG.vignette.angle;
                    if( sineMat.uniforms.uFrequency )
                        sineMat.uniforms.uFrequency.value = CFG.sine.frequency;
                    if( sineMat.uniforms.uAmplitude )
                        sineMat.uniforms.uAmplitude.value = CFG.sine.amplitude;
                    if( sineMat.uniforms.uRotation )
                        sineMat.uniforms.uRotation.value = CFG.sine.rotation;
                    if( shatterMat.uniforms.uAmount )
                        shatterMat.uniforms.uAmount.value = CFG.shatter.scale;
                    if( shatterMat.uniforms.uSpread )
                        shatterMat.uniforms.uSpread.value = CFG.shatter.amount;
                    if( shatterMat.uniforms.uAngle )
                        shatterMat.uniforms.uAngle.value = CFG.shatter.angle / 360;
                    if( shatterMat.uniforms.uSkew )
                        shatterMat.uniforms.uSkew.value = CFG.shatter.skew;
                    if( bokehMat.uniforms.uAmount )
                        bokehMat.uniforms.uAmount.value = CFG.bokeh.radius;
                    if( bokehMat.uniforms.uTilt )
                        bokehMat.uniforms.uTilt.value = CFG.bokeh.tilt;

                    // 3. Aggiorna i widget visivi di TweakPane per riflettere i nuovi valori
                    pane.refresh();

                }
            );

        }
    );

</script>

<style lang="scss" src="./Base.scss"></style>
