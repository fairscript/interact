export function mapParameterNamesToTableAliases(parameterNames: string[]): { [parameterName: string]: string } {
    return parameterNames.reduce(
        (acc, parameter, index) => {
            acc[parameter] = `t${index+1}`

            return acc
        },
        {})
}