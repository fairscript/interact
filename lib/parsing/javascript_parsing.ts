import * as A from 'arcsecond'
import {identifier} from './javascript/identifier_parsing'
import {
    closingBracket,
    closingParenthesis,
    comma,
    openingBracket,
    openingParenthesis,
    semicolon
} from './javascript/single_character_parsing'

export function createLambdaParser(returnParser) {
    const functionSignature = A.sequenceOf([
        openingParenthesis,
        A.sequenceOf([
            identifier,
            A.many(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace, identifier]).map(([ws1, c, ws2, parameter]) => parameter))
        ]),
        closingParenthesis,
    ]).map(([op, [head, tail], cp]) => [head].concat(tail))

    return A.sequenceOf([
        A.str('function'),
        A.optionalWhitespace,
        functionSignature,
        A.optionalWhitespace,
        A.sequenceOf([
            openingBracket,
            A.optionalWhitespace,
            A.str('return'),
            A.optionalWhitespace,
            returnParser,
            A.optionalWhitespace,
            semicolon,
            A.optionalWhitespace,
            closingBracket
        ])
            .map(([ob, ws1, ret, ws2, returnParserResult, ws3, sc, ws4, cb]) => returnParserResult)
    ])
        .map(([str, ws1, parameters, ws2, body]) => [parameters, body])
}

