import * as getParameterNames from 'get-parameter-names'
import {Constructor} from '../select_statement'
import {createGet, ColumnOperation} from '../column_operations'

export function extractPropertiesFromConstructor<T>(constructor: Constructor<T>): Array<ColumnOperation> {
    return getParameterNames(constructor)
        .map(property => createGet(1, property))
}
