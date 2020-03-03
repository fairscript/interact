export function computeTableAlias(name: string, alias: string): string {
    return `${name} ${alias}`
}

export function generateFrom(name: string): string {
    return 'FROM ' + computeTableAlias(name, 't1')
}