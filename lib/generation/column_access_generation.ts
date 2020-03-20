import * as toSnakeCase from 'js-snakecase'

export function generateColumnAccess(tableAlias: string, property: string): string {
    return `${tableAlias}.${toSnakeCase(property)}`
}