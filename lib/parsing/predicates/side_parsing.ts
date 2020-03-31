import * as A from 'arcsecond'
import {aValue} from '../values/value_parsing'
import {createGetColumnParser} from '../get_column_parsing'
import {Value} from '../../value'

export interface Constant {
    kind: 'constant'
    value: Value
}

export function createConstant(value: Value): Constant {
    return {
        kind: 'constant',
        value
    }
}

const constantParser = aValue
    .map(createConstant)

export function createConstantOrGetColumnSideParser(tableParameters: string[]) {
    return A.choice([
        constantParser,
        createGetColumnParser(tableParameters)
    ])
}