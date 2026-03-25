<template>
    <u-modal
        class="ring ring-primary/25"
        :close="{ onClick: () => $emit( 'close', false ) }"
        default-open
        :description="description"
        :dismissible="false"
        size="xl"
        :title="title"
        :ui="{
            close: 'hidden',
            footer: 'flex w-full items-center justify-end gap-2',
        }"
    >
        <template #footer>

            <u-button
                :disabled="loading"
                :label="closeLabel"
                variant="link"
                @click="$emit( 'close', false )"
            />

            <u-button
                icon="line-md:confirm"
                :label="confirmLabel"
                :loading="loading"
                @click="$emit( 'close', true )"
            />

        </template>
    </u-modal>
</template>

<script setup lang="ts">

    interface Properties {
        title?: string
        description?: string
        loading?: boolean
        closeLabel?: string
        confirmLabel?: string
    }

    type Emits = ( event: 'close', value: boolean ) => void;

    withDefaults(
        defineProps<Properties>(),
        {
            title: undefined,
            description: undefined,
            loading: false,
            closeLabel: 'Annulla',
            confirmLabel: 'Conferma',
        }
    );

    defineEmits<Emits>();

</script>
