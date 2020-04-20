import {generateWhereSql} from './where_generation'
import {generateCountSelection} from './selection/count_selection_generation'
import {CountSelection} from '../parsing/selection/count_selection'
import {SingleColumnSelection} from '../parsing/selection/single_column_selection_parsing'
import {generateSingleColumnSelection} from './selection/single_column_selection_generation'
import {joinWithWhitespace} from '../join'
import {Filter} from '../parsing/filtering/filter_parsing'

export function generateSubselectStatement(
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    selection: CountSelection|SingleColumnSelection,
    tableName: string,
    filters: Filter[]): string {

    const parts: string[] = []

    const SELECT = 'SELECT ' + generateSubselectSelection(generateConvertToInt, generateConvertToFloat, selection)
    parts.push(SELECT)

    const FROM = `FROM ${tableName} s1`
    parts.push(FROM)

    if (filters.length > 0) {
        const WHERE = generateWhereSql(namedParameterPrefix, filters)
        parts.push(WHERE)
    }

    return `(${joinWithWhitespace(parts)})`
}

function generateSubselectSelection(
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    selection: CountSelection|SingleColumnSelection): string {
    switch (selection.kind) {
        case 'count-selection':
            return generateCountSelection()
        case 'single-column-selection':
            return generateSingleColumnSelection(generateConvertToInt, generateConvertToFloat, selection)
    }
}