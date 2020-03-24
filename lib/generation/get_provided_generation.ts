import {GetProvided,} from '../column_operations'

export function generateGetProvided(get: GetProvided): string {
    let parts = [get.prefix, get.placeholder]

    if (get.path !== null) {
        parts.push(get.path)
    }

    return '$' + parts.join('_')
}

