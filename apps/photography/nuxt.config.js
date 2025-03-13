// Nuxt
import { defineNuxtConfig } from 'nuxt/config';

// Node
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const currentDirectory = dirname( fileURLToPath( import.meta.url ) );

// Nuxt Config
export default defineNuxtConfig(
    {

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
                    lang: 'it',
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

        appId: 'photography-portfolio',

        compatibilityDate: '2025-03-12',

        css: [
            'modern-normalize',
            join( currentDirectory, './app/assets/styles/main.scss' ),
            join( currentDirectory, './app/assets/styles/root.scss' ),
            '~/assets/styles/override-variables.scss',
        ],

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

        nitro: {
            compressPublicAssets: {
                brotli: true,
                gzip: true,
            },
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

    }
);
