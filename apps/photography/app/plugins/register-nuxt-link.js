// @ts-expect-error - Gli import dinamici di Nuxt danno fastidio a Typescript alcune volte

// Nuxt
import { NuxtLink } from '#components'; // eslint-disable-line import-x/no-unresolved

// Nuxt Plugin
export default defineNuxtPlugin(
    {
        name: 'register-nuxt-link',
        parallel: true,
        setup( nuxtApp ) {

            nuxtApp.vueApp.component( 'NuxtLink', NuxtLink );

        },
    }
);
