<template>
    <div class="error-background">
        <div class="wrapper">
            <div class="composition">
                <div class="layer-0 shelf">
                    <div class="shelf__side_left" />
                    <div class="shelf__side_bottom" />

                    <div
                        v-for="n in 47"
                        :key="n"
                        class="case"
                        :class="`case_${ n }`"
                    >
                        <div class="case__front" />
                        <div class="case__top" />
                        <div class="case__label case__label_right" />
                        <div class="case__right" />
                        <div class="animate-pulse case__number max-w-10">
                            UNIBO
                        </div>
                    </div>

                    <div class="glow">
                        <div class="glow__bottom" />
                        <div class="glow__top" />
                        <div class="glow__ball glow__ball_1" />
                        <div class="glow__ball glow__ball_2" />
                        <div class="glow__ball glow__ball_3" />
                        <div class="glow__ball glow__ball_4" />
                        <div class="glow__ball glow__ball_5" />
                        <div class="glow__ball glow__ball_6" />
                        <div class="glow__ball glow__ball_7" />
                        <div class="glow__ball glow__ball_8" />
                        <div class="glow__ball glow__ball_9" />
                        <div class="glow__ball glow__ball_10" />

                    </div>

                    <div class="shelf__side_front" />
                    <div class="shelf__side_right" />

                    <div class="shelf__handle_top" />
                    <div class="shelf__handle_front" />
                    <div class="shelf__handle_right" />
                </div>
                <div class="layer-1" />
                <div class="layer-2 numbers">
                    <div
                        v-for="( n, index ) in numbers"
                        :key="n"
                        class="numbers__item"
                        :class="`numbers__item_${ index + 1 }`"
                        v-text="n"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

    // Types
    import type { NuxtError } from '#app';

    interface Properties {
        error?: NuxtError
    }

    const
        // Props
        props = defineProps<Properties>()
        // Data
        , numbers = computed<string[]>(
            () => {

                if( props.error && ( props.error.status || ( props.error.cause as NuxtError ).status ) )
                    return [ ... String( props.error.status || ( props.error.cause as NuxtError ).status ) ];

                return [
                    '5',
                    '0',
                    '0',
                ];

            }
        )
    ;

</script>

<style lang="scss" scoped src="./ErrorBackground.scss"></style>
