import {Subselect} from '../column_operations'
import {generateSelect} from './select_generation'
import {createCountSelection} from '../parsing/selection/count_parsing'
import {generateWhere} from './where_generation'
import {joinWithWhitespace} from '../parsing/javascript_parsing'

export function generateSubselect(subselect: Subselect): string {
    const {tableName, filters} = subselect.statement

    const parts = []

    const SELECT = generateSelect(createCountSelection())
    parts.push(SELECT)

    const FROM = `FROM ${tableName} s1`
    parts.push(FROM)

    if (filters.length > 0) {
        const WHERE = generateWhere(filters)
        parts.push(WHERE)
    }

    return `(${joinWithWhitespace(parts)})`
}