import * as A from 'arcsecond'

const parameterlessInvocation = A.str('()')

export function createParameterlessFunctionInvocation(functionName: string) {
    return A.sequenceOf([A.str(functionName), A.optionalWhitespace, parameterlessInvocation])
        .map(([functionName, ws, invocation]) => functionName)

}

export function createParameterlessFunctionInvocationChoice(functionNames: string[]) {
    return A.choice(functionNames.map(createParameterlessFunctionInvocation))
}