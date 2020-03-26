export function generateAlias(column: string, alias: string): string {
    return `${column} AS "${alias}"`
}