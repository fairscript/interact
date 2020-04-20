import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule} from '@fairscript/interact/lib/databases/ensuring_columns_in_select_distinct_clause_are_referenced_in_order_clause_rule'
import {
    AggregateColumn,
    createAggregateColumn
} from '@fairscript/interact/lib/parsing/aggregation/aggregate_column_parsing'
import {createConvertToInteger} from '@fairscript/interact/lib/parsing/conversions'
import {GetColumn} from '@fairscript/interact/lib/parsing/value_expressions/get_column_parsing'
import {createBooleanColumnAggregationAdaptationRule} from '@fairscript/interact/lib/databases/boolean_column_aggregation_adaptation_rule'

function adaptAggregateColumn(
    aggregateColumn: AggregateColumn): AggregateColumn {
    const {aggregationFunction, aggregated} = aggregateColumn

    switch (aggregateColumn.aggregationFunction) {
        case 'min':
        case 'max':
            return aggregateColumn
        case 'sum':
        case 'avg':
            return createAggregateColumn(aggregationFunction, createConvertToInteger(aggregated as GetColumn))
    }
}

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
        ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule,
        createBooleanColumnAggregationAdaptationRule(adaptAggregateColumn)
    ]
}