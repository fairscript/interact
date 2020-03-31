import * as A from 'arcsecond'
import {aValue} from '../values/value_parsing'
import {createGetColumnParser} from '../get_column_parsing'
import {Value} from '../../value'
import {theNull} from '../values/null_parsing'
import {createGetProvidedParser} from '../get_provided_parsing'

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

export interface Null {
    kind: 'null'
}

function createNull(): Null {
    return {
        kind: 'null'
    }
}

export function createParameterlessSideParser(tableParameters: string[]) {
    return A.choice([
        theNull.map(createNull),
        aValue.map(createConstant),
        createGetColumnParser(tableParameters)
    ])
}

export function createParameterizedSideParser(prefix: string, placeholderParameter: string, tableParameters: string[]) {
    const providedSideParser = createGetProvidedParser(prefix, placeholderParameter)
    const constantOrColumnSideParser = createParameterlessSideParser(tableParameters)

    return A.choice([providedSideParser, constantOrColumnSideParser])
}
