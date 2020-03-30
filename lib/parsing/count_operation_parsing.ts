import {createParameterlessFunctionInvocation} from './javascript/invocation_parsing'

export interface CountOperation {
    kind: 'count-operation'
}

export function createCountOperation(): CountOperation {
    return {
        kind: 'count-operation'
    }
}

export function createCountOperationParser(countParameter) {
    return createParameterlessFunctionInvocation(countParameter)
        .map(() => createCountOperation())
}