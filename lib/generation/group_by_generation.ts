import {generateGetFromParameter} from './get_from_parameter_generation'
import {Key} from '../parsing/get_key_parsing'
import {joinWithCommaWhitespace} from '../parsing/parsing_helpers'

function generateKey(key: Key): string {
    const { parameterToTable, parts } = key

    return joinWithCommaWhitespace(parts.map(part => generateGetFromParameter(parameterToTable, part.get)))
}

export function generateGroupBy<T, K>(key: Key): string {
    return 'GROUP BY ' + generateKey(key)
}