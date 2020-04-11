import {generateColumnAccess} from '../column_access_generation'
import {GetColumn} from '../../parsing/value_expressions/get_column_parsing'

export function generateGetColumn(parameterNameToTableAlias: { [parameterName: string]: string }, get: GetColumn): string {
    const tableAlias = parameterNameToTableAlias[get.object]
    const columnName = get.property

    return generateColumnAccess(tableAlias, columnName)
}