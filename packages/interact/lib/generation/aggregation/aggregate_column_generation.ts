import {AggregateColumn} from '../../parsing/aggregation/aggregate_column_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {GetColumn} from '../../parsing/value_expressions/get_column_parsing'
import {AdaptBooleanAsInteger, ConvertToInteger} from '../../parsing/conversions'

function generatedAggregated(
    generateConvertToInt: (input: string) => string,
    generateConvertToFloat: (input: string) => string,
    parameterNameToTableAlias: { [part: string]: string },
    aggregated: GetColumn|AdaptBooleanAsInteger|ConvertToInteger) {
    const getColumn = aggregated.kind === 'get-column' ? aggregated : aggregated.get
    const generatedGetColumn = generateGetColumn(parameterNameToTableAlias, getColumn)

    switch (aggregated.kind) {
        case 'get-column':
            return generatedGetColumn
        case 'adapt-boolean-as-integer':
        case 'convert-to-integer':
            return generateConvertToInt(generatedGetColumn)
    }
}

export function generateAggregateColumn(
    generateConvertToInt: (input: string) => string,
    generateConvertToFloat: (input: string) => string,
    parameterNameToTableAlias: { [part: string]: string },
    aggregateColumn: AggregateColumn): string {

    return `${aggregateColumn.aggregationFunction.toUpperCase()}(${generatedAggregated(generateConvertToInt, generateConvertToFloat, parameterNameToTableAlias, aggregateColumn.aggregated)})`
}