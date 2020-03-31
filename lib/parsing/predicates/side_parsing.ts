import * as A from 'arcsecond'
import {aNumber, aString, createValueParser} from '../javascript/value_parsing'
import {createConstant, createGetColumn} from '../../column_operations'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'
import {identifier} from '../javascript/identifier_parsing'

export function createConstantOrColumnSideParser(tableParameters: string[]) {
    return A.choice([
        createValueParser(aString.map(x => x.slice(1, x.length - 1)), aNumber)
            .map(v => createConstant(v)),
        createNamedObjectPropertyParser(tableParameters, identifier)
            .map(([object, property]) => createGetColumn(object, property))
    ])
}