import {GroupSelection, TableSelection} from '../parsing/selection/selection_parsing'
import {generateCountSelection} from './selection/count_selection_generation'
import {generateMapSelection} from './selection/map_selection_generation'
import {generateGroupAggregationSelection} from './selection/group_aggregation_selection_generation'
import {generateSingleTableSelection} from './selection/single_table_selection_generation'
import {generateMultiTableSelection} from './selection/multi_table_selection_generation'
import {generateSingleColumnSelection} from './selection/single_column_selection_generation'
import {generateTableAggregationSelection} from './selection/table_aggregation_selection_generation'
import {Key} from '../parsing/get_key_parsing'


function generateTableSelection(aliasEscape: string|null, namedParameterPrefix: string, selection: TableSelection): string {
    switch (selection.kind) {
        case 'count-selection':
            return generateCountSelection()
        case 'single-column-selection':
            return generateSingleColumnSelection(selection)
        case 'single-table-selection':
            return generateSingleTableSelection(aliasEscape, selection)
        case 'multi-table-selection':
            return generateMultiTableSelection(aliasEscape, selection)
        case 'table-aggregation-selection':
            return generateTableAggregationSelection(aliasEscape, selection)
        case 'map-selection':
            return generateMapSelection(aliasEscape, namedParameterPrefix, selection)
    }
}

export function generateTableSelect (distinct: boolean, aliasEscape: string|null, namedParameterPrefix: string, selection: TableSelection): string {
    let result = 'SELECT'
    result += ' '

    if (distinct) {
        result += 'DISTINCT'
        result += ' '
    }

    result += generateTableSelection(aliasEscape, namedParameterPrefix, selection)

    return result
}

function generateGroupSelection(aliasEscape: string|null, namedParameterPrefix: string, selection: GroupSelection, key: Key): string {
    switch (selection.kind) {
        case 'group-aggregation-selection':
            return generateGroupAggregationSelection(aliasEscape, namedParameterPrefix, selection, key)
    }
}

export function generateGroupSelect(distinct: boolean, aliasEscape: string|null, namedParameterPrefix: string, key: Key, selection: GroupSelection): string {
    let result = 'SELECT'
    result += ' '

    if (distinct) {
        result += 'DISTINCT'
        result += ' '
    }

    result += generateGroupSelection(aliasEscape, namedParameterPrefix, selection, key)

    return result
}