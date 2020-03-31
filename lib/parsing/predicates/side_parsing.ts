import * as A from 'arcsecond'
import {valueParser} from '../values/value_parsing'
import {createConstant} from '../../column_operations'
import {createGetColumnParser} from '../get_column_parsing'

const constantParser = valueParser
    .map(createConstant)

export function createConstantOrGetColumnSideParser(tableParameters: string[]) {
    return A.choice([
        constantParser,
        createGetColumnParser(tableParameters)
    ])
}