import {identifier} from './identifier_parsing'
import {createChoiceFromStrings} from '../parsing_helpers'
import {dot} from './single_character_parsing'

export function createObjectPropertyParser(objectParser, propertyParser) {
    return A.sequenceOf([objectParser, dot, propertyParser])
        .map(([object, dot, property]) => [object, property])
}

export function createNamedObjectPropertyParser(objectNames: string[], propertyParser = identifier) {
    return createObjectPropertyParser(createChoiceFromStrings(objectNames), propertyParser)
}