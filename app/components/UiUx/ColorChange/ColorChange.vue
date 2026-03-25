<template>
    <u-color-mode-switch
        v-if="type === 'switch'"
        color="warning"
        :size="size"
        title="Cambia chiaro/scuro"
        variant="subtle"
        @click="startViewTransition"
    >
        <template #fallback>
            <u-button
                class="rounded-full"
                color="warning"
                disabled
                :size="size"
                title="Cambia chiaro/scuro"
                variant="subtle"
            />
        </template>
    </u-color-mode-switch>
    <u-color-mode-button
        v-else
        class="rounded-full"
        color="warning"
        :size="size"
        title="Cambia chiaro/scuro"
        variant="subtle"
        @click="startViewTransition"
    >
        <template #fallback>
            <u-button
                class="rounded-full"
                color="warning"
                disabled
                :size="size"
                title="Cambia chiaro/scuro"
                variant="subtle"
            />
        </template>
    </u-color-mode-button>
</template>

<script setup lang="ts">

    interface Properties {
        size?: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
        type?: 'button' | 'switch';
    }

    withDefaults(
        defineProps<Properties>(),
        {
            size: 'md',
            type: 'button',
        }
    );

    const startViewTransition = async( event: MouseEvent ) => {

        if( ! document.startViewTransition )
            return;

        const
            x = event.clientX
            , y = event.clientY
            , endRadius = Math.hypot(
                Math.max( x, window.innerWidth - x ),
                Math.max( y, window.innerHeight - y )
            )
            , transition = document.startViewTransition()
        ;

        await transition.ready;

        const duration = 600;

        document.documentElement.animate(
            { clipPath: [ `circle(0px at ${ x }px ${ y }px)`, `circle(${ endRadius }px at ${ x }px ${ y }px)` ] },
            {
                duration,
                easing: 'cubic-bezier(.76,.32,.29,.99)',
                pseudoElement: '::view-transition-new(root)',
            }
        );

    };

</script>
