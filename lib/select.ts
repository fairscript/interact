import {Constructor} from './table'
import * as getParameterNames from 'get-parameter-names'
import * as toSnakeCase from 'js-snakecase'

export function computeFieldList<T>(constructor: Constructor<T>): string {
    return getParameterNames(constructor)
        .map(toSnakeCase)
        .map(name => `t1.${name}`)
        .join(', ')
}

export function generateSelect<T>(constructor: Constructor<T>): string {
    return 'SELECT ' + computeFieldList(constructor)
}