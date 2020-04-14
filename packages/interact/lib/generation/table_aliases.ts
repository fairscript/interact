export function computeTableAlias(prefix: 't'|'s', tableIndex: number) {
    return `${prefix}${tableIndex+1}`
}


export function mapParameterNamesToTableAliases(parameterNames: string[], prefix: 't'|'s' = 't'): { [parameterName: string]: string } {
    return parameterNames.reduce(
        (acc, parameter, index) => {
            acc[parameter] = computeTableAlias(prefix, index)

            return acc
        },
        {})
}