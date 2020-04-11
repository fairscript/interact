import {AggregateColumn} from '../../parsing/aggregation/aggregate_column_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'

export function generateAggregateColumn(
    parameterNameToTableAlias: { [part: string]: string },
    aggregateColumn: AggregateColumn): string {

    return `${aggregateColumn.aggregationFunction.toUpperCase()}(${generateGetColumn(parameterNameToTableAlias, aggregateColumn.get)})`
}