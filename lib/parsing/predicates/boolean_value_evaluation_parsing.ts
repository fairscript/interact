import * as A from 'arcsecond'
import {aBoolean} from '../values/boolean_parsing'
import {createNegationParser, Negation} from './negation_parsing'
import {createConstant} from './side_parsing'


export function createConstantBooleanValueEvaluationParser() {
    const booleanToConstant = aBoolean.map(createConstant)

    return A.choice([
        createNegationParser(booleanToConstant),
        booleanToConstant
    ])
}

export function createParameterlessBooleanValueEvaluationParser(getColumnParser) {
    return A.choice([
        createNegationParser(getColumnParser),
        getColumnParser,
        createConstantBooleanValueEvaluationParser()
    ])
}

export function createParameterizedBooleanValueEvaluationParser(getProvidedParser, getColumnParser) {
    return A.choice([
        createNegationParser(getProvidedParser),
        getProvidedParser,
        createParameterlessBooleanValueEvaluationParser(getColumnParser)
    ])
}