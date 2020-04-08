export function computeTableAlias(prefix: string, tableIndex: number) {
    return `${prefix}${tableIndex+1}`
}


export function mapParameterNamesToTableAliases(parameterNames: string[], prefix: string = 't'): { [parameterName: string]: string } {
    return parameterNames.reduce(
        (acc, parameter, index) => {
            acc[parameter] = computeTableAlias(prefix, index)

            return acc
        },
        {})
}