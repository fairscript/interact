import {GetColumn,} from '../column_operations'
import {generateColumnAccess} from './column_access_generation'

export function generateGetColumn(parameterNameToTableAlias: { [parameterName: string]: string }, get: GetColumn): string {
    const tableAlias = parameterNameToTableAlias[get.object]
    const columnName = get.property

    return generateColumnAccess(tableAlias, columnName)
}