// Library
import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'; // eslint-disable-line import-x/no-unresolved

// Config
export default defineConfig(
    {
        images: [ './public/images/logo-1024.jpg' ],
        preset: minimal2023Preset,
    }
);
