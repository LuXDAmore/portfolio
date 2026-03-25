<template>
    <div class="flex flex-1 flex-col gap-4 items-center justify-center p-6 text-center text-muted-foreground">

        <u-empty
            :class="{
                'ring-error/25': !! error,
            }"
            description="Verifica i filtri di ricerca o qualcosa è andato storto"
            :icon="error ? 'lucide:triangle-alert' : 'lucide:inbox'"
            :title="error ? `C'è stato un errore durante il caricamento dei dati` : 'Nessun dato disponibile'"
        />

        <p v-if="error?.message" class="block max-w-full text-error text-sm truncate w-200">
            C'è un messaggio di errore: <strong class="font-bold" v-text="error.message" />
        </p>
        <p v-if="searchTerm" class="text-sm">
            Prova a modificare o rimuovere il filtro di ricerca "<strong class="font-bold" v-text="searchTerm" />".
        </p>

    </div>
</template>

<script setup lang="ts">

    // Types
    interface Properties {
        searchTerm?: string
        error?: Error
    }

    // Props
    defineProps<Properties>();

</script>
