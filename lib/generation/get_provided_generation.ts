import {GetProvided,} from '../column_operations'
import {joinWithUnderscore} from '../parsing/parsing_helpers'

export function escapeUnderscore(input: string): string {
    return input.replace(/_/g, '__')
}

export function generatePath(path: string[]): string {
    const escapedPath = path.map(escapeUnderscore)

    return joinWithUnderscore(escapedPath)
}

export function generateGetProvided(get: GetProvided): string {
    let parts = []

    parts.push(get.prefix)

    parts.push(get.placeholder)

    if (get.path.length > 0) {
        parts.push(generatePath(get.path))
    }

    return '$' + parts.join('_')
}

