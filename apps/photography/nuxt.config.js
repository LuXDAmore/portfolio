// Node
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Package
import packageJson from './package.json';

// Nuxt
import { defineNuxtConfig } from 'nuxt/config';

const
    // Active directory
    currentDirectory = dirname( fileURLToPath( import.meta.url ) )
    // Check build value
    , isProduction = process.env.NODE_ENV === 'production'
;

// Nuxt Config
export default defineNuxtConfig(
    {
        alias: {
            '=': fileURLToPath( new URL( 'app/', import.meta.url ) ), // eslint-disable-line compat/compat,
            '==': fileURLToPath( new URL( '.', import.meta.url ) ), // eslint-disable-line compat/compat,
        },

        // ?: Da attivare per debug, utilissimo
        /*
          debug: isProduction,
          devtools: isProduction,
          sourcemap: true,
          vite: { build: { minify: false, }, },
      */

        app: {
            baseURL: '/',
            head: {
                htmlAttrs: {
                    'data-v': packageJson.version,
                    lang: 'en',
                    translate: 'no',
                },
                link: [
                    {
                        href: '/favicon.ico',
                        rel: 'shortcut icon',
                        type: 'image/x-icon',
                    },
                    {
                        href: '/safari-pinned-tab.svg',
                        rel: 'mask-icon',
                    },
                ],
                meta: [
                    { charset: 'utf-16' },
                    {
                        content: process.env.NUXT_DESCRIPTION || 'Nuxt - Base Layer',
                        name: 'description',
                    },
                    {
                        content: 'yes',
                        name: 'mobile-web-app-capable',
                    },
                    {
                        content: '#1f5052',
                        key: 'theme-color-light',
                        media: '(prefers-color-scheme: light)',
                        name: 'theme-color',
                    },
                    {
                        content: '#e6fffb',
                        key: 'theme-color-dark',
                        media: '(prefers-color-scheme: dark)',
                        name: 'theme-color',
                    },
                    {
                        content: '#1f5052',
                        name: 'msapplication-TileColor',
                    },
                    {
                        content: 'default',
                        key: 'status-bar-light',
                        media: '(prefers-color-scheme: light)',
                        name: 'apple-mobile-web-app-status-bar-style',
                    },
                    {
                        content: 'black-translucent',
                        key: 'status-bar-dark',
                        media: '(prefers-color-scheme: dark)',
                        name: 'apple-mobile-web-app-status-bar-style',
                    },
                    {
                        content: 'IE=edge',
                        'http-equiv': 'X-UA-Compatible',
                    },
                    {
                        content: 'on',
                        'http-equiv': 'x-dns-prefetch-control',
                    },
                    {
                        content: '/browserconfig.xml',
                        name: 'msapplication-config',
                    },
                ],
                title: process.env.NUXT_TITLE || 'Luca Iaconelli - Nuxt - Base Layer',
                titleTemplate: `%s - ${ process.env.NUXT_TITLE || 'Luca Iaconelli - Nuxt - Base Layer' }`,
                viewport: 'width=device-width,initial-scale=1',
            },
            layoutTransition: {
                mode: 'out-in',
                name: 'mds-animation--layout',
            },
            pageTransition: {
                mode: 'out-in',
                name: 'mds-animation--page',
            },
        },

        appId: 'photography',
        compatibilityDate: '2025-03-12',

        css: [
            'modern-normalize',
            join( currentDirectory, './app/assets/styles/main.scss' ),
            join( currentDirectory, './app/assets/styles/root.scss' ),
            '~/assets/styles/override-variables.scss',
        ],

        // pruneHtml: {
        //     hideGenericMessagesInConsole: isProduction,
        // },

        devServer: {
            https: {
                cert: './certificates/server.cert.pem',
                key: './certificates/server.key.pem'
            }
        },

        experimental: {

            defaults: {
                nuxtLink: {
                    prefetchOn: {
                        interaction: true,
                        visibility: false,
                    },
                },
            },

            typedPages: true,
            watcher: 'parcel',

        },

        future: { compatibilityVersion: 4 },

        modules: [
            '@nuxtjs/seo',
            '@pinia/nuxt',
            '@wpnuxt/core',
            '@vite-pwa/nuxt'
        ],

        nitro: {
            compressPublicAssets: {
                brotli: isProduction,
                gzip: isProduction,
            },
            publicAssets: [
                {
                    baseURL: 'images',
                    dir: 'public/images',
                    maxAge: 60 * 60 * 24 * 365,
                },
                {
                    baseURL: 'images',
                    dir: 'public/videos',
                    maxAge: 60 * 60 * 24 * 365,
                },
            ],
        },

        pwa: {
            client: { installPrompt: false },
            devOptions: {
                navigateFallback: undefined, // ?: https://github.com/nuxt/nuxt/issues/24748
                suppressWarnings: true,
                type: 'module',
            },
            disable: process.env.NODE_ENV === 'development',
            includeAssets: [ 'favicon.ico', ],
            includeManifestIcons: true,
            injectManifest: { minify: true },
            manifest: {
                display: 'standalone',
                name: process.env.PORTAL_SHORT_NAME,
                short_name: process.env.PORTAL_SHORT_NAME,
                start_url: '/',
                theme_color: '#005F65',
            },
            minify: true,
            registerType: 'autoUpdate',
            workbox: { cleanupOutdatedCaches: true },
        },

        routeRules: {
            // ?: Add cache headers for CSS/JS files
            '/_nuxt/*.css': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
            '/_nuxt/*.js': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
        },

        router: { options: { scrollBehaviorType: 'smooth', } },

        srcDir: 'app',

        vite: {
            css: {
                preprocessorOptions: {
                    scss: {
                        additionalData: '@use "@luxdamore/stylesheets" as *;',
                        api: 'modern-compiler',
                        quietDeps: true,
                    },
                },
            },
            vue: { template: { compilerOptions: { whitespace: 'condense' } } },
        },

        wpNuxt: { wordpressUrl: process.env.WORDPRESS_URL, },

    }
);
