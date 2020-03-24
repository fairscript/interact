import {GetProvided,} from '../column_operations'
import {joinWithUnderscore} from '../parsing/parsing_helpers'

export function generateGetProvided(get: GetProvided): string {
    let parts = [get.prefix]

    if (get.path.length === 0) {
        parts.push(get.placeholder)
    }
    else {
        parts.push(get.placeholder + '_' + joinWithUnderscore(get.path))
    }

    return '$' + parts.join('_')
}

