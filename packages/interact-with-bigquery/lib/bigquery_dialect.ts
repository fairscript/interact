import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule} from '@fairscript/interact/lib/databases/ensuring_columns_in_select_distinct_clause_are_referenced_in_order_clause'

export const bigQueryDialect: Dialect = {
    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false,

    clientBooleanResultType: 'boolean',
    clientFloatResultType: 'number',

    generateConvertToInteger(getColumn: string): string {
        return `CAST(${getColumn} AS INT64)`
    },

    generateConvertToFloat(getColumn: string): string {
        return `CAST(${getColumn} AS FLOAT64)`
    },

    selectStatementAdaptionRules: [
        ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule
    ]
}