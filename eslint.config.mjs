import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint'; // eslint-disable-line import-x/no-unresolved
import * as dependPlugin from 'eslint-plugin-depend';
import importPlugin from 'eslint-plugin-import-x';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import unicornPlugin from 'eslint-plugin-unicorn'; // eslint-disable-line import-x/default, import-x/namespace, import-x/no-named-as-default, import-x/no-named-as-default-member
import compatPlugin from 'eslint-plugin-compat';
import globals from 'globals';

import jestPlugin from 'eslint-plugin-jest';
import vitestPlugin from '@vitest/eslint-plugin';
import playwrightPlugin from 'eslint-plugin-playwright';
import vuePlugin from 'eslint-plugin-vue';
// import NuxtEslintConfig from './src/.nuxt/eslint.config.mjs';
import vueParser from 'vue-eslint-parser';
import babelParser from '@babel/eslint-parser';

import promisePlugin from 'eslint-plugin-promise';
import importNewlinesPlugin from 'eslint-plugin-import-newlines';
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import prettierPlugin from 'eslint-plugin-prettier';
import stylisticTsPlugin from '@stylistic/eslint-plugin-ts';

import {
    sharedRules,
    typescriptRules,
    vueAndNuxtGlobals,
    vueAndNuxtRules,
} from './eslint.constants.mjs';

export default tsEslint.config(
    {
        // ?: intentionally uses computed syntax to make it easy to sort the keys
        plugins: {
            '@stylistic/ts': stylisticTsPlugin,
            'eslint-comments': eslintCommentsPlugin,
            import: importPlugin,
            'import-newlines': importNewlinesPlugin,
            jsdoc: jsdocPlugin,
            prettier: prettierPlugin,
            promise: promisePlugin,
            'sort-keys-fix': sortKeysFixPlugin,
        }
    },
    { files: [ '**/*.{ts,tsx,cts,mts,js,cjs,mjs,vue}' ], },
    {
        // ?: config with just ignores is the replacement for `.eslintignore`
        ignores: [
            '**/node_modules/**',
            '**/vendor/**',
            '**/bower_components/**',

            '**/__snapshots__/**',

            '**/build/**',
            '**/.nx/**',
            '**/.yarn/**',

            '**/coverage/**',

            '**/public/**',
            '**/docs/**',
            '**/.nuxt/**',

            '**/configurations/**',
            '**/dist/**',
            '**/.output/**',
            '**/.vscode/**',

            '**/*.min.*',

            '**/sw.js',

            'components.d.ts',
            '**/generated/**',
            '__typed-router.ts',

        ],
    },

    // ?: extends
    eslint.configs.recommended,
    dependPlugin.configs[ 'flat/recommended' ],
    importPlugin.flatConfigs.recommended,
    jsdocPlugin.configs[ 'flat/recommended' ],
    unicornPlugin.configs.recommended,
    compatPlugin.configs[ 'flat/recommended' ],

    // ?: base config
    {
        languageOptions: {
            globals: {
                ... globals.browser,
                ... globals.es2022,
                ... globals.node,
                ... vueAndNuxtGlobals, // FIXME: Da rivedere per i progetti non con Nuxt, però al momento non ho tempo per filtrare per i progetti nel monorepo
            },
            parserOptions: {
                ecmaVersion: 2022,
                parser: babelParser,
                sourceType: 'module',
            },
        },
        linterOptions: { reportUnusedDisableDirectives: 'warn' },
        rules: { ... sharedRules },
        settings: {
            'import-x/external-module-folders': [
                'node_modules',
                'apps/@base',
                'apps/annunci-industriali',
                'apps/fallimenti',
                'apps/quimmo',
                'packages/design-system',
                'packages/nuxt-apis-to-file',
                'packages/stylesheets',
            ],
            'import-x/parsers': { '@typescript-eslint/parser': [ '.ts', '.tsx' ], },
            polyfills: [
                'Promise',
                'fetch',
                'Array.from',
            ],
        },
    },

    // ?: Override the recommended config
    {
        // ?: Test files
        extends: [
            ... tsEslint.configs.recommended, // 'plugin:@typescript-eslint/recommended'
            jestPlugin.configs[ 'flat/style' ], // 'plugin:jest/style'
            jestPlugin.configs[ 'flat/recommended' ], // 'plugin:jest/recommended'
            importPlugin.flatConfigs.typescript, // 'plugin:import/typescript',
            vitestPlugin.configs.recommended.rules, // 'plugin:vitest/recommended',
            playwrightPlugin.configs[ 'flat/recommended' ], // 'plugin:playwright/recommended',
        ],
        files: [
            './apps/**/_{test,spec}_/*.{j,t}s?(x)',
            './apps/**/*.{test,spec}.{j,t}s?(x)',
            './packages/**/_{test,spec}_/*.{j,t}s?(x)',
            './packages/**/*.{test,spec}.{j,t}s?(x)',
            './tests/**/*.{test,spec}.{j,t}s?(x)',
        ],
        languageOptions: {
            globals: { ... jestPlugin.environments.globals.globals, },
            parser: tsEslint.parser,
        },
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
            jestPlugin,
            playwrightPlugin,
            vitestPlugin
        },
        rules: {
            'playwright/no-skipped-test': 'off',
            'vitest/valid-describe-callback': 'warn'
        }
    },
    {
        // ?: Vue and TS files
        extends: [
            importPlugin.flatConfigs.typescript, // 'plugin:import/typescript',
            ... vuePlugin.configs[ 'flat/strongly-recommended' ], // 'plugin:vue/vue3-strongly-recommended'
            ... tsEslint.configs.recommended, // 'plugin:@typescript-eslint/recommended'
            // tsEslint.configs.recommendedTypeChecked, // 'plugin:@typescript-eslint/recommended-type-checked', // ?: Along with Typecheck
            ... tsEslint.configs.stylistic, // 'plugin:@typescript-eslint/stylistic',
            // tsEslint.configs.stylisticTypeChecked, // 'plugin:@typescript-eslint/stylistic-type-checked', // ?: Along with Typecheck
            // NuxtEslintConfig, // FIXME: '@nuxtjs/eslint-config-typescript',
        ],
        files: [ '**/*.vue', '**/*.ts' ],
        languageOptions: {
            globals: { ... vueAndNuxtGlobals, },
            parser: vueParser,
            parserOptions: {
                // project: './tsconfig.json',
                ecmaVersion: 'latest',

                extraFileExtensions: [ '.vue' ],

                parser: tsEslint.parser,
                sourceType: 'module',
            },
        },
        plugins: { '@typescript-eslint': tsEslint.plugin, },
        rules: {
            ... sharedRules,
            ... typescriptRules,
            indent: 'off',
            'sort-keys': 'off',
            'sort-keys-fix/sort-keys-fix': 'off',
            ... vueAndNuxtRules,
        },
    },
    {
        // ?: TS files
        extends: [
            importPlugin.flatConfigs.typescript, // 'plugin:import/typescript'
            ... tsEslint.configs.recommended, // 'plugin:@typescript-eslint/recommended'
            // tsEslint.configs.recommendedTypeChecked, // 'plugin:@typescript-eslint/recommended-type-checked', // ?: Along with Typecheck
            ... tsEslint.configs.stylistic, // 'plugin:@typescript-eslint/stylistic',
            // tsEslint.configs.stylisticTypeChecked, // 'plugin:@typescript-eslint/stylistic-type-checked' // ?: Along with Typecheck
        ],
        files: [ '**/*.ts' ],
        languageOptions: {
            globals: { ... vueAndNuxtGlobals, },
            parser: tsEslint.parser,
            // parserOptions: {
            //     project: './tsconfig.json',
            // },
        },
        plugins: { '@typescript-eslint': tsEslint.plugin, },
        rules: {
            ... sharedRules,
            ... typescriptRules,
        },
    }
);
