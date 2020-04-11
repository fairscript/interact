import * as A from 'arcsecond'
import {nullSingleton} from './null'
import {createLiteral} from './literal'
import {aStringWithoutTheQuotes} from './string_parsing'
import {aNumber} from './number_parsing'
import {aBoolean} from './boolean_parsing'
import {theNull} from './null_parsing'

const aLiteral = [
    aStringWithoutTheQuotes,
    aNumber,
    aBoolean,
    theNull
]

export const literalParser = A.choice(aLiteral)
    .map(value => {
        switch (value) {
            case 'null':
                return nullSingleton
            default:
                return createLiteral(value)
        }
    })