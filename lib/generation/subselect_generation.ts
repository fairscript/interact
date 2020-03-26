import {Subselect} from '../column_operations'
import {generateWhere} from './where_generation'
import {joinWithWhitespace} from '../parsing/parsing_helpers'
import {generateCountSelection} from './selection/count_selection_generation'

export function generateSubselect(namedParameterPrefix: string, useNamedParameterPrefixInRecord: boolean, subselect: Subselect): string {
    const {tableName, filters} = subselect.statement

    const parts = []

    const SELECT = 'SELECT ' + generateCountSelection()
    parts.push(SELECT)

    const FROM = `FROM ${tableName} s1`
    parts.push(FROM)

    if (filters.length > 0) {
        const WHERE = generateWhere(namedParameterPrefix, useNamedParameterPrefixInRecord, filters)[0]
        parts.push(WHERE)
    }

    return `(${joinWithWhitespace(parts)})`
}