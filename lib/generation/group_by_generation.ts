import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import {generateGet} from './column_generation'
import {PartOfKey} from '../parsing/get_key_parsing'

function generateKey(key: PartOfKey[]): string {
    return joinWithCommaWhitespace(key.map(alias => generateGet(alias.get)))
}

export function generateGroupBy<T, K>(key: PartOfKey[]): string {
    return 'GROUP BY ' + generateKey(key)
}