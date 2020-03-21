import * as A from 'arcsecond'
import {identifier} from './identifier_parsing'
import {openingParenthesis} from './single_character_parsing'
import {parameterListParser} from './parameter_list_parsing'

const constructorParser = A.coroutine(function*() {
    yield A.str('function')

    yield A.optionalWhitespace

    yield identifier

    yield A.optionalWhitespace

    yield openingParenthesis

    const parameters = yield parameterListParser

    return parameters
})


export function parseConstructor(constructor: Function): string[] {
    const functionAsString = constructor.toString()

    const result = constructorParser.run(functionAsString).result

    return result
}