export function mapParameterNamesToTableAliases(parameterNames: string[], prefix: string = 't'): { [parameterName: string]: string } {
    return parameterNames.reduce(
        (acc, parameter, index) => {
            acc[parameter] = `${prefix}${index+1}`

            return acc
        },
        {})
}