<template>
    <u-button
        v-for="( item, index ) in filteredItems"
        :key="index"
        :color="item.buttonColor"
        :disabled="item.disabled"
        :icon="item.icon"
        :label="showLabel || item.showLabel ? item.label : undefined"
        size="sm"
        :title="showLabel ? ( item.title || item.description ) : item.label"
        :to="item.to"
        variant="subtle"
        @click="item.onSelect"
    />
</template>

<script setup lang="ts">

    // Nuxt UI - Types
    import type { DropdownMenuItem } from '@nuxt/ui';

    interface Properties {
        items?: DropdownMenuItem[]
        showLabel?: boolean
    }

    // Setup
    const
        // Props
        props = withDefaults(
            defineProps<Properties>(),
            {
                items: () => ( [] ),
                showLabel: false,
            }
        )
        , filteredItems = computed( () => props.items?.filter( item => ! item.type || item.type === 'link' ) )
    ;

</script>
