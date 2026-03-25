import type { DateValue } from '@internationalized/date';

export const formatDate = (
    value?: Date | DateValue | number | string,
    lang?: string,
    config?: Intl.DateTimeFormatOptions,
): string => {

    if( ! value )
        return String( value );

    if( typeof value === 'object' && 'year' in value && 'month' in value && 'day' in value )
        value = new Date( value.year, value.month - 1, value.day );

    const v = (
            value instanceof Date
                ? value
                : new Date( value )
        )
        , options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            hour12: false,
            month: '2-digit',
            year: 'numeric',
            ... config,
        }
        , isInValid = typeof v === 'string' && Number.isNaN( v )
    ;

    if( isInValid )
        return String( value );

    return new Intl
        .DateTimeFormat(
            lang,
            options,
        )
        .format( v )
    ;

};

export const formatDateTime = (
    value?: Date | number | string,
    lang?: string,
    config?: Intl.DateTimeFormatOptions,
): string => {

    if( ! value )
        return String( value );

    const v = (
            value instanceof Date
                ? value
                : new Date( value )
        )
        , options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            hour: '2-digit',
            hour12: false,
            minute: '2-digit',
            month: '2-digit',
            year: 'numeric',
            ... config,
            ... config,
        }
        , isInValid = typeof v === 'string' && Number.isNaN( v )
    ;

    if( isInValid )
        return String( value );

    return new Intl
        .DateTimeFormat(
            lang,
            options,
        )
        .format( v )
    ;

};

export const formatTime = (
    value?: Date | number | string,
    lang?: string,
    config?: Intl.DateTimeFormatOptions,
): string => {

    if( ! value )
        return String( value );

    const v = (
            value instanceof Date
                ? value
                : new Date( value )
        )
        , options: Intl.DateTimeFormatOptions = {
            day: undefined,
            hour: '2-digit',
            hour12: false,
            minute: '2-digit',
            month: undefined,
            second: undefined,
            year: undefined,
            ... config,
        }
        , isInValid = typeof v === 'string' && Number.isNaN( v )
    ;

    if( isInValid )
        return String( value );

    return new Intl
        .DateTimeFormat(
            lang,
            options,
        )
        .format( v )
    ;

};

export const formatDay = (
    value?: Date | number | string,
    lang?: string,
    config?: Intl.DateTimeFormatOptions,
): string => {

    if( ! value )
        return String( value );

    const v = value instanceof Date ? value : new Date( value );

    if( Number.isNaN( v.getTime() ) )
        return String( value );

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        hour12: false,
        ... config,
    };

    return new Intl.DateTimeFormat( lang, options ).format( v );

};

export const formatMonth = (
    value?: Date | number | string,
    lang?: string,
    config?: Intl.DateTimeFormatOptions,
): string => {

    if( ! value )
        return String( value );

    const v = value instanceof Date ? value : new Date( value );

    if( Number.isNaN( v.getTime() ) )
        return String( value );

    const options: Intl.DateTimeFormatOptions = {
        hour12: false,
        month: 'short',
        ... config,
    };

    return new Intl.DateTimeFormat( lang, options ).format( v );

};
