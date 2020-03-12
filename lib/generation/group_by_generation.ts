import {Get} from '../parsing/select_parsing'
import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import {generateGet} from './select_generation'

function generateKey(key: Get[]): string {
    return joinWithCommaWhitespace(key.map(generateGet))
}

export function generateGroupBy<T, K>(key: Get[]): string {
    return 'GROUP BY ' + generateKey(key)
}