import * as A from 'arcsecond'
import {closingParenthesis, openingParenthesis} from './single_character_parsing'

const parameterlessInvocation = A.str('()')

export function createParameterlessFunctionInvocation(functionName: string) {
    return A.sequenceOf([A.str(functionName), A.optionalWhitespace, parameterlessInvocation])
        .map(([functionName, ws, invocation]) => functionName)

}

export function createParameterlessFunctionInvocationChoice(functionNames: string[]) {
    return A.choice(functionNames.map(createParameterlessFunctionInvocation))
}

export function createOneParameterFunctionInvocation(functionName: string, parameterParser) {
    return A.sequenceOf([A.str(functionName), A.optionalWhitespace, openingParenthesis, A.optionalWhitespace, parameterParser, A.optionalWhitespace, closingParenthesis])
        .map(([functionName, ws1, op, ws2, p, ws3, cp]) => [functionName, p])

}