import {createParameterlessFunctionInvocation} from '../javascript/invocation_parsing'

export interface CountRowsInGroup {
    kind: 'count-rows-in-group'
}

export function createCountRowsInGroup(): CountRowsInGroup {
    return {
        kind: 'count-rows-in-group'
    }
}

export function createCountParser(countParameter) {
    return createParameterlessFunctionInvocation(countParameter)
        .map(() => createCountRowsInGroup())
}