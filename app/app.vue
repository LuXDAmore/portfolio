<template>
    <u-app
        :locale="en"
        :toaster="toaster"
    >

        <nuxt-announcer />
        <nuxt-route-announcer />

        <nuxt-loading-indicator color="oklch(0.86 0.1 82.37)" />

        <three-base />

        <u-main class="min-h-screen">
            <nuxt-layout>

                <nuxt-page />

            </nuxt-layout>
        </u-main>

    </u-app>
</template>

<script setup lang="ts">

    // Nuxt - UI
    import { en } from '@nuxt/ui/locale';

    // Third Party - Zod
    import { config } from 'zod';
    import { en as zodLocale } from 'zod/locales';

    // Types
    import type { ToasterProps } from '@nuxt/ui';

    const
        // Route
        route = useRoute()
        // Runtime Config
        , { public: { portal: { name } } } = useRuntimeConfig()
        // Notifications
        , toaster: ToasterProps = { position: 'bottom-right' }
    ;

    useHead( { titleTemplate: () => `${ route.meta?.title || name } — %s` } );

    config( zodLocale() );

</script>
