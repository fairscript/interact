import * as toSnakeCase from 'js-snakecase'

import {GetSelection} from '../../parsing/selection/get_parsing'

export function generateGetSelection(selection: GetSelection): string {
    return `${selection.table}.${toSnakeCase(selection.property)}`
}