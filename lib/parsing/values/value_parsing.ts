import * as A from 'arcsecond'
import {aStringWithoutTheQuotes} from './string_parsing'
import {aNumber} from './number_parsing'
import {aBoolean} from './boolean_parsing'

export const aValue = A.choice([aStringWithoutTheQuotes, aNumber, aBoolean])