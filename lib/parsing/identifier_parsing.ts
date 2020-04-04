import * as A from 'arcsecond'

// A JavaScript identifier must start with a letter, underscore (_), or dollar sign ($). Subsequent characters can also be digits (0–9).
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
import {dollarSign, underscore} from './literals/single_character_parsing'
import {join} from './parsing_helpers'

const startOfIdentifier = A.choice([A.letter, underscore, dollarSign])
const endOfIdentifier = A.many(A.choice([A.letter, underscore, dollarSign, A.digit])).map(join)
export const identifier = A.sequenceOf([startOfIdentifier, endOfIdentifier]).map(join)