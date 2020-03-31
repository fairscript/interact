import * as A from 'arcsecond'
import {aStringWithoutTheQuotes} from './string_parsing'
import {aNumber} from './number_parsing'

export const valueParser = A.choice([aStringWithoutTheQuotes, aNumber])