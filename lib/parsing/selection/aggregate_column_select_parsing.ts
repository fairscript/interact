import {Selection} from '../selection_parsing'
import {parseGetColumn} from '../get_column_parsing'
import {AggregationFunction, createAggregateColumn} from '../aggregation/aggregate_column_parsing'
import {createSingleColumnSelection, SingleColumnSelection} from './single_column_selection_parsing'

export function parseAggregateColumnSelection(f: Function, aggregationFunction: AggregationFunction): SingleColumnSelection {
    const [parameterNameToTableAlias, getColumn] = parseGetColumn(f)
    const aggregateColumn = createAggregateColumn(aggregationFunction, getColumn)

    return createSingleColumnSelection(parameterNameToTableAlias, aggregateColumn)
}

export function parseMaxSelection(f: Function): Selection {
    return parseAggregateColumnSelection(f, 'max')
}

export function parseMinSelection(f: Function): Selection {
    return parseAggregateColumnSelection(f, 'min')
}

export function parseAverageSelection(f: Function): Selection {
    return parseAggregateColumnSelection(f, 'avg')
}

export function parseSumSelection(f: Function): Selection {
    return parseAggregateColumnSelection(f, 'sum')
}