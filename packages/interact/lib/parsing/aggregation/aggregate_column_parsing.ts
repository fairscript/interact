import * as A from 'arcsecond'
import {identifier} from '../identifier_parsing'
import {dot} from '../literals/single_character_parsing'
import {createParameterlessFunctionInvocationChoice} from '../functions/invocation_parsing'
import {createNamedObjectPropertyParser} from '../literals/record_parsing'
import {createGetColumn, GetColumn} from '../value_expressions/get_column_parsing'
import {AdaptBooleanAsInteger, ConvertToInteger} from '../conversions'

export type AggregationFunction = 'avg' | 'min' | 'max' | 'sum'

export function mapLibraryAggregateFunctionNameToSqlFunctionName(library): AggregationFunction {
    switch (library) {
        case 'average':
            return 'avg'
        default:
            return library
    }
}

export interface AggregateColumn {
    kind: 'aggregate-column'
    aggregationFunction: AggregationFunction
    aggregated: GetColumn|AdaptBooleanAsInteger|ConvertToInteger
}

export function createAggregateColumn(aggregationFunction: AggregationFunction, aggregated: GetColumn|AdaptBooleanAsInteger|ConvertToInteger): AggregateColumn {
    return {
        kind: 'aggregate-column',
        aggregationFunction,
        aggregated
    }
}

export function createAggregateColumnParser(objectParameterNames) {
    const columnAggregation = A.sequenceOf([identifier, dot, createParameterlessFunctionInvocationChoice(['avg', 'min', 'max', 'sum'])])
        .map(([property, dot, aggregation_function]) => [property, aggregation_function])

    return createNamedObjectPropertyParser(objectParameterNames, columnAggregation)
        .map(([object, [property, aggregation_function]]) => createAggregateColumn(aggregation_function, createGetColumn(object, property)))
}