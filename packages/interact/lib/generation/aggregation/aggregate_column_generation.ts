import {AggregateColumn} from '../../parsing/aggregation/aggregate_column_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {GetColumn} from '../../parsing/value_expressions/get_column_parsing'
import {ImplicitlyConvertBooleanToInteger} from '../../parsing/conversions'

function generatedAggregated(
    generateImplicitlyConvertBooleanToInteger: (input: string) => string,
    parameterNameToTableAlias: { [part: string]: string },
    aggregated: GetColumn|ImplicitlyConvertBooleanToInteger) {

    switch (aggregated.kind) {
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, aggregated)
        case 'implicitly-convert-boolean-to-integer':
            return generateImplicitlyConvertBooleanToInteger(generateGetColumn(parameterNameToTableAlias, aggregated.get))
    }
    
}

export function generateAggregateColumn(
    generateConvertToInt: (input: string) => string,
    parameterNameToTableAlias: { [part: string]: string },
    aggregateColumn: AggregateColumn): string {

    return `${aggregateColumn.aggregationFunction.toUpperCase()}(${generatedAggregated(generateConvertToInt, parameterNameToTableAlias, aggregateColumn.aggregated)})`
}