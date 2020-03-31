import {Selection} from '../parsing/selection/selection_parsing'
import {generateCountSelection} from './selection/count_selection_generation'
import {generateMapSelection} from './selection/map_selection_generation'
import {generateGroupAggregationSelection} from './selection/group_aggregation_selection_generation'
import {generateSingleTableSelection} from './selection/single_table_selection_generation'
import {generateMultiTableSelection} from './selection/multi_table_selection_generation'
import {generateSingleColumnSelection} from './selection/single_column_selection_generation'
import {generateTableAggregationSelection} from './selection/table_aggregation_selection_generation'


function generateSelection(aliasEscape: string|null, namedParameterPrefix: string, selection: Selection): string {
    switch (selection.kind) {
        case 'count-selection':
            return generateCountSelection()
        case 'single-column-selection':
            return generateSingleColumnSelection(selection)
        case 'single-table-selection':
            return generateSingleTableSelection(aliasEscape, selection)
        case 'multi-table-selection':
            return generateMultiTableSelection(aliasEscape, selection)
        case 'group-aggregation-selection':
            return generateGroupAggregationSelection(aliasEscape, selection)
        case 'table-aggregation-selection':
            return generateTableAggregationSelection(aliasEscape, selection)
        case 'map-selection':
            return generateMapSelection(aliasEscape, namedParameterPrefix, selection)
    }
}

export function generateSelect (aliasEscape: string|null, namedParameterPrefix: string, selection: Selection, distinct: boolean): string {
    let result = 'SELECT'
    result += ' '

    if (distinct) {
        result += 'DISTINCT'
        result += ' '
    }

    result += generateSelection(aliasEscape, namedParameterPrefix, selection)

    return result
}