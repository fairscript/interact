import * as A from 'arcsecond'
import {createNestedObjectPropertyParser} from '../literals/record_parsing'
import {identifier} from '../identifier_parsing'

export interface GetProvided {
    kind: 'get-provided',
    prefix: string,
    placeholder: string,
    path: string[]
}

export function createGetProvided(prefix: string, placeholder: string, path: string[]): GetProvided {
    return {
        kind: 'get-provided',
        prefix,
        placeholder,
        path
    }
}

export function createGetProvidedParser(prefix: string, placeholderParameter: string) {
    return A.choice([
        createNestedObjectPropertyParser(A.str(placeholderParameter), identifier)
            .map(([object, path]) => createGetProvided(prefix, object, path)),
        A.str(placeholderParameter)
            .map(() => createGetProvided(prefix, placeholderParameter, [])),
    ])
}