import {Key, PartOfKey} from '../../parsing/get_key_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {joinWithCommaWhitespace} from '../../join'

export function generateGetPartOfKey(key: Key, keyPartAlias: string): string {
    const keyPart = key.partsOfKey.find(p => p.alias === keyPartAlias) as PartOfKey

    return generateGetColumn(key.parameterToTable, keyPart.get)
}

export function generateKey(key: Key): string {
    const {parameterToTable, partsOfKey} = key

    return joinWithCommaWhitespace(partsOfKey.map(part => generateGetColumn(parameterToTable, part.get)))
}