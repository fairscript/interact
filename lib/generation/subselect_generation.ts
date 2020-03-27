import {Subselect} from '../column_operations'
import {generateWhereSql} from './where_generation'
import {joinWithWhitespace} from '../parsing/parsing_helpers'
import {generateCountSelection} from './selection/count_selection_generation'

export function generateSubselect(namedParameterPrefix: string, subselect: Subselect): string {
    const {tableName, filters} = subselect.statement

    const parts: string[] = []

    const SELECT = 'SELECT ' + generateCountSelection()
    parts.push(SELECT)

    const FROM = `FROM ${tableName} s1`
    parts.push(FROM)

    if (filters.length > 0) {
        const WHERE = generateWhereSql(namedParameterPrefix, filters)
        parts.push(WHERE)
    }

    return `(${joinWithWhitespace(parts)})`
}