import * as A from 'arcsecond'
import {
    aReturn, closingBracket,
    closingParenthesis,
    comma,
    identifier,
    openingBracket,
    openingParenthesis,
    semicolon
} from './javascript_parsing'

interface LambdaFunctionParsingResult {
    parameters: string[],
    expression: string
}

const lambdaFunctionParser = A.coroutine(function*() {
    yield A.sequenceOf([A.str('function'), A.optionalWhitespace, openingParenthesis, A.optionalWhitespace])

    const parameters = []

    const head = yield A.possibly(identifier)

    if (head != null) {
        parameters.push(head)

        const tail = yield A.many(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace, identifier])
            .map(([ws1, c, ws2, parameter]) => parameter))
        parameters.push(...tail)
    }

    yield A.sequenceOf([A.optionalWhitespace, closingParenthesis])

    yield A.sequenceOf([A.optionalWhitespace, openingBracket, A.optionalWhitespace, aReturn, A.optionalWhitespace])

    const expression = yield A.everythingUntil(A.sequenceOf([semicolon, A.optionalWhitespace, closingBracket, A.optionalWhitespace, A.endOfInput]))

    return {
        parameters,
        expression
    }
})

export function parseLambdaFunction(f: Function): LambdaFunctionParsingResult {
    const functionAsString = f.toString()

    return lambdaFunctionParser.run(functionAsString).result
}