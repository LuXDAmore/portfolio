export const formatNumber = (
    value: number | string,
    lang?: string,
    config?: Intl.NumberFormatOptions,
) => {

    if( ! value )
        return value;

    const v = (
            typeof value === 'number'
                ? value
                : Number.parseInt( value, 10 )
        )
        , options: Intl.NumberFormatOptions = {

            minimumIntegerDigits: 3,
            useGrouping: true,

            ... config,

        }
        , isValid = typeof v === 'number' && ! Number.isNaN( v )
    ;

    if( ! isValid )
        return value;

    // ?: Per numeri piccoli, impedisco si visualizzi lo zero davanti, esempio 099
    if( v < 100 )
        options.minimumIntegerDigits = 1;

    return new Intl
        .NumberFormat(
            lang,
            options,
        )
        .format( v )
    ;

};
