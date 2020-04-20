import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule} from '@fairscript/interact/lib/databases/ensuring_columns_in_select_distinct_clause_are_referenced_in_order_clause_rule'
import {createBooleanColumnAggregationAdaptationRule} from '@fairscript/interact/lib/databases/boolean_column_aggregation_adaptation_rule'
import {
    AggregateColumn,
    createAggregateColumn
} from '@fairscript/interact/lib/parsing/aggregation/aggregate_column_parsing'
import {GetColumn} from '@fairscript/interact/lib/parsing/value_expressions/get_column_parsing'
import {
    createAdaptBooleanAsInteger,
    createConvertToInteger
} from '@fairscript/interact/lib/parsing/conversions'

function adaptAggregateColumn(
    aggregateColumn: AggregateColumn): AggregateColumn {
    const {aggregationFunction, aggregated} = aggregateColumn

    switch (aggregateColumn.aggregationFunction) {
        case 'min':
        case 'max':
            return createAggregateColumn(aggregationFunction, createAdaptBooleanAsInteger(aggregated as GetColumn))
        case 'sum':
        case 'avg':
            return createAggregateColumn(aggregationFunction, createConvertToInteger(aggregated as GetColumn))
    }
}

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

    selectStatementAdaptionRules: [
        ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule,
        createBooleanColumnAggregationAdaptationRule(adaptAggregateColumn)
    ]
}