import * as A from 'arcsecond'
import {aBoolean} from '../literals/boolean_parsing'
import {createNegationParser, Negation} from './negation_parsing'
import {createLiteral} from '../literals/literal'


export function createLiteralBooleanValueEvaluationParser() {
    const booleanToLiteral = aBoolean.map(createLiteral)

    return A.choice([
        createNegationParser(booleanToLiteral),
        booleanToLiteral
    ])
}

export function createParameterlessBooleanValueEvaluationParser(getColumnParser) {
    return A.choice([
        createNegationParser(getColumnParser),
        getColumnParser,
        createLiteralBooleanValueEvaluationParser()
    ])
}

export function createParameterizedBooleanValueEvaluationParser(getProvidedParser, getColumnParser) {
    return A.choice([
        createNegationParser(getProvidedParser),
        getProvidedParser,
        createParameterlessBooleanValueEvaluationParser(getColumnParser)
    ])
}