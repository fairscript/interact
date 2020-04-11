import * as A from 'arcsecond'
import {AggregateColumn, createAggregateColumnParser} from './aggregate_column_parsing'
import {CountOperation, createCountOperationParser} from '../count_operation_parsing'

export type TableAggregationOperation = AggregateColumn|CountOperation

export function createTableAggregationOperationParser(objectParameterNames: string[], countParameter: string|null) {
    const aggregateColumnParser = createAggregateColumnParser(objectParameterNames)

    if (countParameter !== null) {
        const countParser = createCountOperationParser(countParameter)

        return A.choice([aggregateColumnParser, countParser])
    }
    else {
        return aggregateColumnParser
    }
}