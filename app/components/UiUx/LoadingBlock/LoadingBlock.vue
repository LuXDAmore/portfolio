<template>
    <div class="flex gap-7 h-full items-center justify-center loading-block overflow-hidden p-2 w-full">

        <div class="overflow-hidden relative" :class="[ heightClass, widthClass ]">

            <u-skeleton class="rounded-xl" :class="[ heightClass, widthClass ]" />

            <div v-if="! hideBook" class="absolute book-container flex inset-0 items-center justify-center z-10">
                <div class="book">
                    <div class="book__pg-shadow" />
                    <div class="book__pg" />
                    <div class="book__pg book__pg--2" />
                    <div class="book__pg book__pg--3" />
                    <div class="book__pg book__pg--4" />
                    <div class="book__pg book__pg--5" />
                </div>
            </div>

        </div>

        <div class="flex flex-col gap-1.5">
            <p class="animate-pulse text-muted whitespace-nowrap">
                Caricamento dati, attendere prego..
            </p>
            <u-skeleton class="h-4 w-62.5" />
            <u-skeleton class="h-4 w-50" />
            <u-skeleton class="h-4 w-25" />
        </div>

    </div>
</template>

<script setup lang="ts">

   // Types
    interface Properties {
        heightClass?: string
        widthClass?: string
        hideBook?: boolean
    }

    // Props
    withDefaults(
        defineProps<Properties>(),
        {
            heightClass: 'h-80',
            widthClass: 'w-80',
            hideBook: false,
        }
    );

</script>

<style lang="scss" scoped src="./LoadingBlock.scss"></style>
