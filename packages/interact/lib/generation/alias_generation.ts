export function generateAlias(aliasEscape: string|null, column: string, alias: string): string {
    let result = ''
    result += column
    result += ' '
    result += 'AS'
    result += ' '

    if (aliasEscape !== null) {
        result += aliasEscape
        result += alias
        result += aliasEscape
    }
    else {
        result += alias
    }

    return result
}