import * as A from 'arcsecond'
import {
    closingBracket,
    closingParenthesis, openingBracket,
    openingParenthesis,
    semicolon
} from './single_character_parsing'
import {parameterListParser} from './parameter_list_parsing'

export const lambdaSignatureParser = A.coroutine(function*() {
    yield A.str('function')
    yield A.optionalWhitespace
    yield openingParenthesis
    yield A.optionalWhitespace

    const parameters = yield parameterListParser

    yield A.optionalWhitespace
    yield closingParenthesis

    return parameters
})

const startOfLambdaBody = A.sequenceOf([
    openingBracket,
    A.optionalWhitespace,
    A.str('return'),
    A.optionalWhitespace
])


const endOfLambdaBody = A.sequenceOf([
    semicolon,
    A.optionalWhitespace,
    closingBracket
])

export function createLambdaBodyParser(returnParser) {
    return A.coroutine(function*() {
        yield startOfLambdaBody

        const returnExpression = yield returnParser

        yield endOfLambdaBody

        return returnExpression
    })
}

export function createLambdaParser(createFunctionBodyParser) {
    return A.coroutine(function*() {
        const parameters = yield lambdaSignatureParser

        yield A.optionalWhitespace

        const functionBody = yield createFunctionBodyParser(parameters)

        return [parameters, functionBody]
    })
}

export const wildcardLambdaParser =
    createLambdaParser(
        () => createLambdaBodyParser(A.everythingUntil(A.sequenceOf([endOfLambdaBody, A.optionalWhitespace, A.endOfInput])))
    )

interface LambdaExtractionResult {
    parameters: string[],
    expression: string
}

export function extractLambdaParametersAndExpression(f: Function): LambdaExtractionResult {
    const functionAsString = f.toString().replace(/\r\n/g, ' ').replace(/\n/g, ' ')

    return wildcardLambdaParser
        .map(([parameters, expression]) => ({ parameters, expression }))
        .run(functionAsString).result

}