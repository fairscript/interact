import {createNamedObjectPropertyParser} from '../javascript/record_parsing'

export interface GetPartOfKey {
    kind: 'get-part-of-key',
    part: string,
}

export function createGetPartOfKey(part: string): GetPartOfKey {
    return {
        kind: 'get-part-of-key',
        part
    }
}

export function createGetPartOfKeyParser(keyParameterName) {
    return createNamedObjectPropertyParser([keyParameterName])
        .map(([object, partOfKey]) => createGetPartOfKey(partOfKey))
}