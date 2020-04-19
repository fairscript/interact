import {Dialect} from '@fairscript/interact/lib/databases/dialects'

export const sqliteDialect: Dialect = {
    aliasEscape: null,
    namedParameterPrefix: '$',
    useNamedParameterPrefixInRecord: true,

    clientBooleanResultType: 'number',
    clientFloatResultType: 'number',

    generateConvertToInteger(getColumn: string): string {
        return `CAST(${getColumn} AS integer)`
    },

    generateConvertToFloat(getColumn: string): string {
        return `CAST(${getColumn} AS float)`
    },

    selectStatementAdaptionRules: []
}