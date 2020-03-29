import * as A from 'arcsecond'
import {createGetPartOfKeyParser, GetPartOfKey} from './aggregation/get_part_of_key_parsing'
import {AggregateColumn, createAggregateColumnParser} from './aggregation/aggregate_column_parsing'
import {CountRowsInGroup, createCountParser} from './aggregation/count_rows_in_group_parsing'

export type AggregationOperation = GetPartOfKey|AggregateColumn|CountRowsInGroup

export function createAggregationOperationParser(keyParameterName: string, objectParameterNames: string[], countParameter: string|null) {
    const valueParsers: any[] = []

    if (countParameter != null) {
        const countParser = createCountParser(countParameter)
        valueParsers.push(countParser)
    }

    const accessKeyParser = createGetPartOfKeyParser(keyParameterName)
    valueParsers.push(accessKeyParser)

    const aggregateColumnParser = createAggregateColumnParser(objectParameterNames)
    valueParsers.push(aggregateColumnParser)

    return A.choice(valueParsers)
}