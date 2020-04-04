import * as A from 'arcsecond'
import {aValue} from '../values/value_parsing'
import {theNull} from '../values/null_parsing'
import {createNegationParser} from './negation_parsing'
import {aBoolean} from '../values/boolean_parsing'
import {createLiteral} from '../values/literal'
import {nullSingleton} from '../values/null'

export function createLiteralSideParser() {
    return A.choice([
        createNegationParser(aBoolean.map(createLiteral)),
        aValue.map(createLiteral),

        theNull.map(() => nullSingleton)
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
