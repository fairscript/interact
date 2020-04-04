import * as A from 'arcsecond'
import {aValue, aValueOrNull} from '../values/value_parsing'
import {createNegationParser} from './negation_parsing'
import {aBoolean} from '../values/boolean_parsing'
import {createLiteral} from '../values/literal'
import {nullSingleton} from '../values/null'

export function createLiteralSideParser() {
    return A.choice([
        createNegationParser(aBoolean.map(createLiteral)),
        aValueOrNull.map(value => {
            switch (value) {
                case 'null':
                    return nullSingleton
                default:
                    return createLiteral(value)
            }
        }),
    ])
}

export function createParameterlessSideParser(getColumnParser) {
    return A.choice([
        createNegationParser(getColumnParser),
        getColumnParser,
        createLiteralSideParser()
    ])
}

export function createParameterizedSideParser(getProvidedParser, getColumnParser) {
    const choices = [
        createNegationParser(getProvidedParser),
        getProvidedParser
    ]

    if (getColumnParser !== null) {
        choices.push(createParameterlessSideParser(getColumnParser))
    }

    return A.choice(choices)
}
