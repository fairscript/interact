import {Value} from '../../value'

export interface Literal {
    kind: 'literal'
    value: Value
}

export function createLiteral(value: Value): Literal {
    return {
        kind: 'literal',
        value
    }
}