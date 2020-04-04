import * as A from 'arcsecond'
import {aValue} from '../values/value_parsing'
import {Value} from '../../value'
import {theNull} from '../values/null_parsing'
import {createNegationParser} from './negation_parsing'
import {aBoolean} from '../values/boolean_parsing'

export interface Constant {
    kind: 'constant'
    value: Value
}

export function createConstant(value: Value): Constant {
    return {
        kind: 'constant',
        value
    }
}

export interface Null {
    kind: 'null'
}

export const nullSingleton: Null = {
    kind: 'null'
}

export function createConstantSideParser() {
    return A.choice([
        createNegationParser(aBoolean.map(createConstant)),
        aValue.map(createConstant),

        theNull.map(() => nullSingleton)
    ])
}

export function createParameterlessSideParser(getColumnParser) {
    return A.choice([
        createNegationParser(getColumnParser),
        getColumnParser,
        createConstantSideParser()
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
