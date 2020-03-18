import {GetFromParameter,} from '../column_operations'
import * as toSnakeCase from 'js-snakecase'

export function generateGetFromParameter(parameterNameToTableAlias: { [parameterName: string]: string }, get: GetFromParameter): string {
    const tableAlias = parameterNameToTableAlias[get.parameter]
    const columnName = toSnakeCase(get.property)

    return `${tableAlias}.${columnName}`
}

