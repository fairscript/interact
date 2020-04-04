import * as A from 'arcsecond'
import {createNegationParser} from '../boolean_expressions/negation_parsing'
import {aBoolean} from '../literals/boolean_parsing'
import {createLiteral} from '../literals/literal'
import {literalParser} from '../literals/literal_parsing'

export const literalValueExpressionParser =
    A.choice([
        createNegationParser(aBoolean.map(createLiteral)),
        literalParser
    ])

export function createParameterlessValueExpressionParser(getColumnParser) {
    return A.choice([
        createNegationParser(getColumnParser),
        getColumnParser,

        literalValueExpressionParser
    ])
}

export function createParameterizedValueExpressionParser(getProvidedParser, getColumnParser) {
    const choices = [
        createNegationParser(getProvidedParser),
        getProvidedParser
    ]

    if (getColumnParser !== null) {
        choices.push(createParameterlessValueExpressionParser(getColumnParser))
    }

    return A.choice(choices)
}
