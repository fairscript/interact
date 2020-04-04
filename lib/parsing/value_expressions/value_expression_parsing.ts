import * as A from 'arcsecond'
import {aValueOrNull} from '../values/value_parsing'
import {createNegationParser} from '../boolean_expressions/negation_parsing'
import {aBoolean} from '../values/boolean_parsing'
import {createLiteral} from '../values/literal'
import {nullSingleton} from '../values/null'

export const literalValueExpressionParser =
    A.choice([
        createNegationParser(aBoolean.map(createLiteral)),
        aValueOrNull.map(value => {
            switch (value) {
                case 'null':
                    return nullSingleton
                default:
                    return createLiteral(value)
            }
        })
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
