import {Selection} from '../parsing/selection_parsing'
import {generateCountSelection} from './selection/count_selection_generation'
import {generateGetSelection} from './selection/get_selection_generation'
import {generateMapSelection} from './selection/map_selection_generation'
import {generateAggregationSelection} from './selection/aggregation_selection_generation'
import {generateSingleTableSelection} from './selection/single_table_selection_generation'
import {generateMultiTableSelection} from './selection/multi_table_selection_generation'


function generateSelection(selection: Selection): string {
    switch (selection.kind) {
        case 'count-selection':
            return generateCountSelection()
        case 'single-table-selection':
            return generateSingleTableSelection(selection)
        case 'multi-table-selection':
            return generateMultiTableSelection(selection)
        case 'get-selection':
            return generateGetSelection(selection)
        case 'aggregation':
            return generateAggregationSelection(selection)
        case 'map-selection':
            return generateMapSelection(selection)
    }
}

export function generateSelect (selection: Selection): string {
    return 'SELECT ' + generateSelection(selection)
}