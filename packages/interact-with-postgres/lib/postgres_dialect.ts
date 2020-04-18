import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'
import {convertAggregatedBooleanColumnToIntegerRule} from './convert_aggregated_boolean_column_to_integer_rule'
import {ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule} from '@fairscript/interact/lib/databases/ensuring_columns_in_select_distinct_clause_are_referenced_in_order_clause'

const statementAdaptationRules: ((statement: (SelectStatement|GroupSelectStatement)) => (SelectStatement|GroupSelectStatement))[] = [
    ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule,
    convertAggregatedBooleanColumnToIntegerRule
]

export const postgresDialect: Dialect = {
    aliasEscape: '"',
    namedParameterPrefix: ':',
    useNamedParameterPrefixInRecord: false,

    clientBooleanResultType: 'boolean',
    clientFloatResultType: 'string',

    generateConvertToInteger(getColumn: string): string {
        return getColumn + '::int'
    },

    generateConvertToFloat(getColumn: string): string {
        return getColumn + '::float'
    },

    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        return statementAdaptationRules.reduce(
            (adaptedStatement, rule) => rule(adaptedStatement),
            statement
        )
    }
}