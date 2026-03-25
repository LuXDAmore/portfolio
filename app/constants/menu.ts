// Types
import type { ButtonProps, NavigationMenuItem, PageFeatureProps } from '@nuxt/ui';

// Menu
export const MENU_ITEMS: NavigationMenuItem[][] = [
    [
        {
            description: 'Panoramica generale dello stato del sistema e accesso rapido alle funzionalità principali',
            icon: 'lucide:layout-dashboard',
            label: 'Dashboard',
            to: '/dashboard',
            value: 'dashboard',
        },
    ],
    [
        {
            children: [
                {
                    description: 'Anagrafica articoli con ricerca rapida per titolo, magazzino e autore',
                    icon: 'lucide:book-open-text',
                    label: 'Articoli',
                    to: '/anagrafiche/articoli',
                    value: 'articoli',
                },
                {
                    description: 'Visualizzazione delle richieste di articoli da parte degli utenti',
                    icon: 'lucide:book-down',
                    label: 'Richieste',
                    to: '/anagrafiche/richieste',
                    value: 'richieste',
                },
                {
                    description: 'Consultazione contenuto e azioni per i magazzini disponibili',
                    icon: 'lucide:store',
                    label: 'Magazzini',
                    to: '/anagrafiche/magazzini',
                    value: 'magazzini',
                },
                {
                    description: 'Gestione delle causali di magazzino per movimenti e operazioni',
                    disabledOnRoles: [ 'BUB_GTL_Uffici' ],
                    icon: 'lucide:file-text',
                    label: 'Causali',
                    to: '/anagrafiche/causali',
                    value: 'causali',
                },
            ],
            description: 'Gestione delle anagrafiche di base come articoli, magazzini e causali',
            icon: 'lucide:table-properties',
            label: 'Anagrafiche',
            to: '/anagrafiche/articoli',
            value: 'anagrafiche',
        },
    ],
    [
        {
            children: [
                {
                    description: 'Movimenti degli articoli nei magazzini',
                    icon: 'mdi:receipt-text-arrow-right',
                    isFeaturedLink: true,
                    label: 'Movimenti',
                    to: '/reports/movimenti',
                    value: 'movimenti',
                },
                // {
                //     description: 'Report missioni torre',
                //     icon: 'mdi:receipt-text-edit',
                //     label: 'Missioni',
                //     to: '/reports/missioni',
                //     value: 'reports-missioni',
                // },
                // {
                //     description: 'Riepilogo e stampa ordini clienti',
                //     icon: 'mdi:receipt-text-clock',
                //     label: 'Ordini',
                //     to: '/reports/ordini',
                //     value: 'reports-ordini',
                // },
                // {
                //     description: 'Visualizza e stampa storico allarmi',
                //     icon: 'lucide:book-alert',
                //     label: 'Storico Allarmi',
                //     to: '/reports/allarmi',
                //     value: 'reports-allarmi',
                // },
            ],
            description: 'Report e riepiloghi per monitorare le attività e lo stato del sistema',
            icon: 'mdi:receipt-text',
            label: 'Reports',
            to: '/reports/movimenti',
            value: 'reports',
        },
    ],
    [
        {
            children: [
                {
                    description: "Muovi uno o più articoli tra un magazzino e l'altro in modo semplice",
                    icon: 'lucide:store',
                    label: 'Trasferisci uno o più articoli tra magazzini',
                    to: '/operazioni/trasferisci-articoli-tra-magazzini',
                    value: 'trasferisci-articoli-tra-magazzini',
                },
            ],
            description: 'Esegui operazioni di magazzino come trasferimenti',
            icon: 'lucide:archive',
            label: 'Operazioni',
            to: '/operazioni/trasferisci-articoli-tra-magazzini',
            value: 'operazioni',
        },
    ],
    [
        {
            children: [
                {
                    description: 'Controlla lo stato della torre e accedi alle funzionalità principali',
                    disabledOnRoles: [ 'BUB_GTL_Uffici' ],
                    icon: 'lucide:radio-tower',
                    label: 'Pannello di controllo',
                    to: '/torre/pannello-di-controllo',
                    value: 'torre-pannello-di-controllo',
                },
                {
                    description: 'Controlla le missioni dalla torre',
                    disabledOnRoles: [ 'BUB_GTL_Uffici' ],
                    icon: 'lucide:baggage-claim',
                    isFeaturedLink: true,
                    label: 'Missioni',
                    to: '/torre/missioni',
                    value: 'missioni',
                },
                {
                    description: 'Controlla il contenuto degli UDC in torre',
                    disabledOnRoles: [ 'BUB_GTL_Uffici' ],
                    icon: 'lucide:boxes',
                    label: 'UDC',
                    to: '/torre/udc',
                    value: 'udc',
                },
                // {
                //     description: 'Controlla gli allarmi dalla torre',
                //     icon: 'lucide:bell',
                //     label: 'Allarmi',
                //     to: '/torre/allarmi',
                //     value: 'allarmi',
                // },
            ],
            description: 'Controlla lo stato della torre e accedi alle funzionalità principali',
            disabledOnRoles: [ 'BUB_GTL_Uffici' ],
            icon: 'lucide:tower-control',
            isFeaturedLink: true,
            label: 'Torre',
            to: '/torre/pannello-di-controllo',
            value: 'torre',
        },
    ],
    [
        {
            description: 'Accedi alla documentazione e alle risorse di supporto',
            label: '?',
            title: 'Aiuto',
            to: '/aiuto',
            value: 'aiuto',
        },
    ],
];

export const MENU_DASHBOARD_UI: PageFeatureProps['ui'] = {
    leadingIcon: 'text-xl',
    root: 'border rounded-sm p-3.5 border-muted hover:border-primary-300 cursor-pointer hover:bg-primary-50/50 transition',
};

export const MENU_DASHBOARD_TO_FEATURES: NavigationMenuItem[] = MENU_ITEMS.flat();

export const MENU_DASHBOARD_FEATURED: PageFeatureProps[] = MENU_DASHBOARD_TO_FEATURES.flatMap(
    group => {

        const
            { children, ... rest } = group
            , childrenToFeatures: PageFeatureProps[] = [ ... ( children ?? [] ), rest ].filter( child => child.isFeatured ).map(
                child => (
                    {
                        description: child.description,
                        disabledOnRoles: child.disabledOnRoles,
                        icon: child.icon,
                        label: child.title || child.label,
                        title: child.label,
                        to: child.to,
                        ui: MENU_DASHBOARD_UI,
                    }
                )
            )
        ;

        return childrenToFeatures;

    }
);
export const MENU_DASHBOARD_LINKS: ButtonProps[] = MENU_DASHBOARD_TO_FEATURES.flatMap(
    group => {

        const
            { children, ... rest } = group
            , childrenToFeatures: PageFeatureProps[] = [ ... ( children ?? [] ), rest ].filter( child => child.isFeaturedLink ).map(
                child => (
                    {
                        disabledOnRoles: child.disabledOnRoles,
                        icon: child.icon,
                        label: child.title || child.label,
                        size: 'xl',
                        title: child.label,
                        to: child.to,
                        trailingIcon: 'lucide:arrow-right',
                        variant: 'subtle',
                    }
                )
            )
        ;

        return childrenToFeatures;

    }
);
