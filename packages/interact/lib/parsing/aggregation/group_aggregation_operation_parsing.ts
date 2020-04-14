import * as A from 'arcsecond'
import {createGetPartOfKeyParser, GetPartOfKey} from './get_part_of_key_parsing'
import {AggregateColumn, createAggregateColumnParser} from './aggregate_column_parsing'
import {CountOperation, createCountOperationParser} from '../count_operation_parsing'
import {SubselectStatement} from '../../statements/subselect_statement'

export type GroupAggregationOperation = GetPartOfKey|AggregateColumn|CountOperation|SubselectStatement

export function createGroupAggregationOperationParser(keyParameterName: string, objectParameterNames: string[], countParameter: string|null) {
    const valueParsers: any[] = []

    if (countParameter !== null) {
        const countParser = createCountOperationParser(countParameter)
        valueParsers.push(countParser)
    }

    const accessKeyParser = createGetPartOfKeyParser(keyParameterName)
    valueParsers.push(accessKeyParser)

    const aggregateColumnParser = createAggregateColumnParser(objectParameterNames)
    valueParsers.push(aggregateColumnParser)

    return A.choice(valueParsers)
}