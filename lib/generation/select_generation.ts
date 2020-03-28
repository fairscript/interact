import {Selection} from '../parsing/selection_parsing'
import {generateCountSelection} from './selection/count_selection_generation'
import {generateGetSelection} from './selection/get_selection_generation'
import {generateMapSelection} from './selection/map_selection_generation'
import {generateAggregationSelection} from './selection/aggregation_selection_generation'
import {generateSingleTableSelection} from './selection/single_table_selection_generation'
import {generateMultiTableSelection} from './selection/multi_table_selection_generation'


function generateSelection(aliasEscape: string|null, namedParameterPrefix: string, selection: Selection): string {
    switch (selection.kind) {
        case 'count-selection':
            return generateCountSelection()
        case 'single-table-selection':
            return generateSingleTableSelection(aliasEscape, selection)
        case 'multi-table-selection':
            return generateMultiTableSelection(aliasEscape, selection)
        case 'get-selection':
            return generateGetSelection(selection)
        case 'aggregation':
            return generateAggregationSelection(aliasEscape, selection)
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