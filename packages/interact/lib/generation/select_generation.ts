import {GroupSelection, TableSelection} from '../parsing/selection/selection_parsing'
import {generateCountSelection} from './selection/count_selection_generation'
import {generateMapSelection} from './selection/map_selection_generation'
import {generateGroupAggregationSelection} from './selection/group_aggregation_selection_generation'
import {generateSingleTableSelection} from './selection/single_table_selection_generation'
import {generateMultiTableSelection} from './selection/multi_table_selection_generation'
import {generateSingleColumnSelection} from './selection/single_column_selection_generation'
import {generateTableAggregationSelection} from './selection/table_aggregation_selection_generation'
import {Key} from '../parsing/get_key_parsing'
import {ColumnTypeRecord} from '../record'
import {generateSingleGroupAggregationSelection} from './selection/single_group_aggregation_operation_selection_generation'


function generateTableSelection(
    aliasEscape: string|null,
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    selection: TableSelection,
    fromColumnRecord: ColumnTypeRecord,
    joinColumnRecords: ColumnTypeRecord[]): string {

    switch (selection.kind) {
        case 'count-selection':
            return generateCountSelection()
        case 'single-column-selection':
            return generateSingleColumnSelection(generateConvertToInt, generateConvertToFloat, selection)
        case 'single-table-selection':
            return generateSingleTableSelection(aliasEscape, selection, fromColumnRecord)
        case 'multi-table-selection':
            return generateMultiTableSelection(aliasEscape, selection, fromColumnRecord, joinColumnRecords)
        case 'table-aggregation-selection':
            return generateTableAggregationSelection(aliasEscape, generateConvertToInt, generateConvertToFloat, selection)
        case 'map-selection':
            return generateMapSelection(aliasEscape, namedParameterPrefix, generateConvertToInt, generateConvertToFloat, selection)
    }
}

export function generateGroupSelect(
    distinct: boolean,
    aliasEscape: string | null,
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    selection: GroupSelection,
    key: Key): string {

    let result = 'SELECT'
    result += ' '

    if (distinct) {
        result += 'DISTINCT'
        result += ' '
    }

    result += generateGroupSelection(aliasEscape, namedParameterPrefix, generateConvertToInt, generateConvertToFloat, selection, key)

    return result
}

export function generateTableSelect (
    distinct: boolean,
    aliasEscape: string|null,
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    selection: TableSelection,
    fromColumnRecord: ColumnTypeRecord,
    joinColumnRecords: ColumnTypeRecord[]): string {

    let result = 'SELECT'
    result += ' '

    if (distinct) {
        result += 'DISTINCT'
        result += ' '
    }

    result += generateTableSelection(aliasEscape, namedParameterPrefix, generateConvertToInt, generateConvertToFloat, selection, fromColumnRecord, joinColumnRecords)

    return result
}

function generateGroupSelection(
    aliasEscape: string|null,
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    selection: GroupSelection,
    key: Key): string {

    switch (selection.kind) {
        case 'group-aggregation-selection':
            return generateGroupAggregationSelection(aliasEscape, namedParameterPrefix, generateConvertToInt, generateConvertToFloat, selection, key)
        case 'single-group-aggregation-operation-selection':
            return generateSingleGroupAggregationSelection(aliasEscape, namedParameterPrefix, generateConvertToInt, generateConvertToFloat, selection, key)
    }
}
