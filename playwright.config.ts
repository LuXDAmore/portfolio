import { fileURLToPath } from 'node:url';

import { defineConfig } from '@playwright/test';

import type { ConfigOptions } from '@nuxt/test-utils/playwright';

// eslint-disable-next-line compat/compat
export default defineConfig<ConfigOptions>( { use: { nuxt: { rootDir: fileURLToPath( new URL( '.', import.meta.url ) ) } } } );
