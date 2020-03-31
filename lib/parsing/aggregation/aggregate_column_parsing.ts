import * as A from 'arcsecond'
import {identifier} from '../javascript/identifier_parsing'
import {dot} from '../javascript/single_character_parsing'
import {createParameterlessFunctionInvocationChoice} from '../javascript/invocation_parsing'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'
import {createGetColumn, GetColumn} from '../get_column_parsing'

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
    get: GetColumn
}

export function createAggregateColumn(aggregationFunction: AggregationFunction, get: GetColumn): AggregateColumn {
    return {
        kind: 'aggregate-column',
        aggregationFunction,
        get
    }
}

export function createAggregateColumnParser(objectParameterNames) {
    const columnAggregation = A.sequenceOf([identifier, dot, createParameterlessFunctionInvocationChoice(['avg', 'min', 'max', 'sum'])])
        .map(([property, dot, aggregation_function]) => [property, aggregation_function])

    return createNamedObjectPropertyParser(objectParameterNames, columnAggregation)
        .map(([object, [property, aggregation_function]]) => createAggregateColumn(aggregation_function, createGetColumn(object, property)))
}