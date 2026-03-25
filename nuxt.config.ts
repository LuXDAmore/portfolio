// Nuxt
import { defineNuxtConfig } from 'nuxt/config';

// Vite - Plugins
import sbom from 'rollup-plugin-sbom';
import glsl from 'vite-plugin-glsl';
import { Mode, plugin as mdPlugin } from 'vite-plugin-markdown';

// Package
import packageJson from './package.json';

const
    COLORS = ( process.env.COLORS || '#f2cd88,#eb7fa4' ).split( ',' )
    , [ PRIMARY_COLOR ] = COLORS ?? []
;

// Nuxt Config
export default defineNuxtConfig(
    {

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
                ],
                meta: [
                    { charset: 'utf-8' },
                    {
                        content: process.env.DESCRIPTION,
                        name: 'description',
                    },
                    {
                        content: 'yes',
                        name: 'mobile-web-app-capable',
                    },
                    {
                        content: PRIMARY_COLOR,
                        key: 'theme-color-light',
                        media: '(prefers-color-scheme: light)',
                        name: 'theme-color',
                    },
                    {
                        content: PRIMARY_COLOR,
                        key: 'theme-color-dark',
                        media: '(prefers-color-scheme: dark)',
                        name: 'theme-color',
                    },
                    {
                        content: PRIMARY_COLOR,
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
                ],
                title: process.env.NAME,
                titleTemplate: `%s - ${ process.env.NAME }`,
                viewport: 'width=device-width,initial-scale=1',
            },
        },

        appId: 'portfolio',

        compatibilityDate: '2026-03-14',

        css: [ '~/assets/styles/ui.css' ],

        devServer: {
            https: {
                cert: './certificates/server.cert.pem',
                key: './certificates/server.key.pem',
            },
        },

        experimental: { nitroAutoImports: true },

        fonts: {
            defaults: {
                styles: [ 'normal', 'italic' ],
                subsets: [ 'latin' ],
                weights: [
                    200,
                    300,
                    400,
                    500,
                    600,
                    700,
                    800,
                    900,
                ],
            },
            families: [
                {
                    name: 'Cormorant Garamond',
                    provider: 'google',
                },
            ],
        },

        future: { compatibilityVersion: 5 },

        htmlValidator: {
            options: {
                rules: {
                    'attribute-allowed-values': 'off',
                    'attribute-misuse': 'off', // ?: Forse da tenere
                    'element-permitted-content': 'off',
                    'heading-level': 'off', // ?: Da tenere
                    'input-missing-label': 'off', // ?: Da valutare se tenerlo
                    'long-title': 'off', // ?: Da tenere
                    'no-redundant-for': 'off', // ?: Da tenere
                    'prefer-native-element': 'off', // ?: Forse da tenere
                    'tel-non-breaking': 'off',
                    'text-content': 'off',
                    'unique-landmark': 'off',
                    'wcag/h32': 'off', // ?: Da tenere
                    'wcag/h71': 'off', // ?: Da tenere
                },
            },
            usePrettier: true,
        },

        llms: {
            description: process.env.DESCRIPTION,
            domain: process.env.URL,
            full: {
                description: 'Full documentation of the application',
                title: 'Full Documentation',
            },
            // TODO: Finire questa per la documentazione rapida da AI
            sections: [
                {
                    description: 'Section 1 Description',
                    links: [
                        {
                            description: 'Link 1 Description',
                            href: '/link-1',
                            title: 'Link 1',
                        },
                        {
                            description: 'Link 2 Description',
                            href: '/link-2',
                            title: 'Link 2',
                        },
                    ],
                    title: 'Section 1',
                },
            ],
            title: process.env.NAME,
        },

        modules: [
            '@nuxt/test-utils/module',
            '@nuxt/eslint',
            '@vueuse/nuxt',
            '@nuxt/image',
            '@nuxt/scripts',
            '@nuxt/fonts',
            '@nuxt/icon',
            '@nuxtjs/mdc',
            '@nuxt/ui',
            '@nuxtjs/html-validator',
            'nuxt-llms',
            '@nuxtjs/seo',
            'nuxt-security',
            '@pinia/nuxt',
            'pinia-plugin-persistedstate/nuxt',
            '@tresjs/nuxt',
            '@vite-pwa/nuxt',
        ],

        nitro: {
            compressPublicAssets: {
                brotli: true,
                gzip: true,
            },
        },

        piniaPluginPersistedstate: {
            key: 'portfolio_%id',
            storage: 'localStorage',
        },

        pwa: {
            client: { installPrompt: true },
            includeAssets: [ 'favicon.ico', 'logo.png' ],
            includeManifestIcons: true,
            injectManifest: { minify: true },
            manifest: {
                display: 'standalone',
                name: process.env.NAME,
                short_name: 'TL',
                start_url: '/',
                theme_color: PRIMARY_COLOR,
            },
            minify: true,
            registerType: 'autoUpdate',
            workbox: { cleanupOutdatedCaches: true },
        },

        runtimeConfig: {

            // Public
            public: {

                api: { url: process.env.API_URL },

                portal: {
                    colors: process.env.COLORS,
                    description: process.env.DESCRIPTION,
                    name: process.env.NAME,
                    url: process.env.URL,
                    version: packageJson.version,
                },

            },

        },

        schemaOrg: {
            minify: true,
            reactive: false,
        },

        site: {
            description: process.env.DESCRIPTION,
            name: process.env.NAME,
            url: process.env.URL,
        },

        sitemap: { zeroRuntime: true },

        spaLoadingTemplate: false,

        ui: {
            theme: {
                colors: [
                    'glow',
                    'petal',
                    'primary',
                    'secondary',
                    'info',
                    'success',
                    'warning',
                    'error',
                ],
            },
        },

        vite: {
            optimizeDeps: {
                include: [
                    '@vue/devtools-core',
                    '@vue/devtools-kit',
                    '@tanstack/vue-table',
                    'zod',
                    'zod/locales',
                    '@vueuse/integrations/useSortable',
                    '@internationalized/date',
                    '@tresjs/core',
                    'three/examples/jsm/*',
                    'tweakpane',
                ],
            },

            plugins: [
                mdPlugin( { mode: [ Mode.MARKDOWN ] } ),
                glsl(),
                sbom(),
            ],
            vue: { template: { compilerOptions: { whitespace: 'condense' } } },
        },

    }
);
