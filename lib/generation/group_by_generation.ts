import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import {Get} from '../column_operations'
import {generateGet} from './column_generation'

function generateKey(key: Get[]): string {
    return joinWithCommaWhitespace(key.map(generateGet))
}

export function generateGroupBy<T, K>(key: Get[]): string {
    return 'GROUP BY ' + generateKey(key)
}