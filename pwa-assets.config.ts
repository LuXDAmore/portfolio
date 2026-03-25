// Library
import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Config
export default defineConfig(
    {
        images: [ './public/icon-512px.jpg' ],
        preset: minimal2023Preset,
    }
);
