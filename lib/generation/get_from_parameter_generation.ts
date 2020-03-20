import {GetFromParameter,} from '../column_operations'
import {generateColumnAccess} from './column_access_generation'

export function generateGetFromParameter(parameterNameToTableAlias: { [parameterName: string]: string }, get: GetFromParameter): string {
    const tableAlias = parameterNameToTableAlias[get.parameter]
    const columnName = get.property

    return generateColumnAccess(tableAlias, columnName)
}

