import {Key} from '../parsing/get_key_parsing'
import {generateKey} from './aggregation/key_generation'

export function generateGroupBy(key: Key): string {
    return 'GROUP BY ' + generateKey(key)
}