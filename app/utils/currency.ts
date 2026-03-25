// Currency
export const formatCurrency = (
    value: number,
    lang?: string,
    config?: Intl.NumberFormatOptions,
) => {

    if( typeof value !== 'number' )
        return value;

    const options: Intl.NumberFormatOptions = {

        currency: 'EUR',
        minimumIntegerDigits: value < 1000 ? 1 : 3,
        useGrouping: true,

        // Overwrite config
        ... config,

        // Intl Options
        style: 'currency',

    };

    // Result
    return new Intl
        .NumberFormat(
            lang,
            options,
        )
        .format( value )
    ;

};
