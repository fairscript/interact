import {GetProvided,} from '../../parsing/value_expressions/get_provided_parsing'
import {joinWithUnderscore} from '../../join'

export function escapeUnderscore(input: string): string {
    return input.replace(/_/g, '__')
}

export function generatePath(path: string[]): string {
    const escapedPath = path.map(escapeUnderscore)

    return joinWithUnderscore(escapedPath)
}

export function computePlaceholderName(get: GetProvided) {
    const parts: string[] = []

    parts.push(get.prefix)

    parts.push(get.placeholder)

    if (get.path.length > 0) {
        parts.push(generatePath(get.path))
    }

    const placeholderName = parts.join('_')

    return placeholderName
}

export function generateGetProvided(namedParameterPrefix: string, get: GetProvided): string {
    return namedParameterPrefix + computePlaceholderName(get)
}

