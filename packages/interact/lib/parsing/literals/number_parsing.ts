import * as A from 'arcsecond'
import {minus, plus} from './single_character_parsing'
import {join} from '../../join'

const plusOrMinus = A.choice([plus, minus])
const optionalPositiveOrNegative = A.possibly(plusOrMinus).map(x => x === null ? '' : x)

const integerWithoutSign = A.choice([A.char('0'), A.regex(/^[1-9][0-9]*/)])
export const integer = A.sequenceOf([optionalPositiveOrNegative, integerWithoutSign]).map(join).map(parseInt)

const floatWithoutSign = A.choice([A.regex(/^[1-9][0-9]+.[0-9]+/), A.regex(/^0.[0-9]+/)])
export const float = A.sequenceOf([optionalPositiveOrNegative, floatWithoutSign]).map(join).map(parseFloat)
export const aNumber = A.choice([integer, float])