import * as A from 'arcsecond'
import {doubleQuote, singleQuote} from './single_character_parsing'
import {join} from '../../join'

const aString =
    A.choice([
        A.sequenceOf([singleQuote, A.many(A.choice([A.str("\\'"), A.anythingExcept(singleQuote)])), singleQuote]),
        A.sequenceOf([doubleQuote, A.many(A.choice([A.str("\\'"), A.anythingExcept(doubleQuote)])), doubleQuote])
    ]).map(([quote1, chars, quote2]) => quote1 + join(chars) + quote2)

export const aStringWithoutTheQuotes = aString.map(x => x.slice(1, x.length - 1))