import * as A from 'arcsecond'
import {aStringWithoutTheQuotes} from './string_parsing'
import {aNumber} from './number_parsing'

export const aValue = A.choice([aStringWithoutTheQuotes, aNumber])