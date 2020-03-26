export interface Dialect {
    aliasEscape: string|null
    namedParameterPrefix: string
    useNamedParameterPrefixInRecord: boolean
}

export const sqliteDialect: Dialect = {
    aliasEscape: null,
    namedParameterPrefix: '$',
    useNamedParameterPrefixInRecord: true
}

export const postgresDialect: Dialect = {
    aliasEscape: '"',
    namedParameterPrefix: ':',
    useNamedParameterPrefixInRecord: false
}

export const bigQueryDialect: Dialect = {
    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false
}