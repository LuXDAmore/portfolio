// Libraries
import { defineVitestProject } from '@nuxt/test-utils/config';
import { defineConfig } from 'vitest/config';

// Tests
export default defineConfig(
    {
        test: {
            projects: [
                {
                    test: {
                        environment: 'node',
                        include: [ 'test/unit/*.{test,spec}.ts' ],
                        name: 'unit',
                    },
                },
                {
                    test: {
                        environment: 'node',
                        include: [ 'test/e2e/*.{test,spec}.ts' ],
                        name: 'e2e',
                    },
                },
                await defineVitestProject(
                    {
                        test: {
                            environment: 'nuxt',
                            include: [ 'test/nuxt/*.{test,spec}.ts' ],
                            name: 'nuxt',
                        },
                    }
                ),
            ],
        },
    }
);
