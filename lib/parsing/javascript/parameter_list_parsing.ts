import * as A from 'arcsecond'

import {identifier} from './identifier_parsing'
import {comma} from './single_character_parsing'

export const parameterListParser = A.coroutine(function* () {
    const parameters: any = []

    const head = yield A.possibly(identifier)

    if (head != null) {
        parameters.push(head)

        const tail = yield A.many(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace, identifier])
            .map(([ws1, c, ws2, parameter]) => parameter))
        parameters.push(...tail)
    }

    return parameters
})