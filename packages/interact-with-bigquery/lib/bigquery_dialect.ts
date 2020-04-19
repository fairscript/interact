import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'
import {ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule} from '@fairscript/interact/lib/databases/ensuring_columns_in_select_distinct_clause_are_referenced_in_order_clause'

const statementAdaptationRules: ((statement: (SelectStatement|GroupSelectStatement)) => (SelectStatement|GroupSelectStatement))[] = [
    ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule
]

export const bigQueryDialect: Dialect = {
    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false,

    clientBooleanResultType: 'boolean',
    clientFloatResultType: 'number',

    generateConvertToInteger(getColumn: string): string {
        return `CAST(${getColumn} AS INT64)`;
    },

    generateConvertToFloat(getColumn: string): string {
        return `CAST(${getColumn} AS FLOAT64)`;
    },

    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        return statementAdaptationRules.reduce(
            (adaptedStatement, rule) => rule(adaptedStatement),
            statement
        )
    }
}