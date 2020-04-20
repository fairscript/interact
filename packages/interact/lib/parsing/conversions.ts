import {GetColumn} from './value_expressions/get_column_parsing'

export interface AdaptBooleanAsInteger {
    get: GetColumn
    kind: 'adapt-boolean-as-integer'
}

export function createAdaptBooleanAsInteger(get: GetColumn): AdaptBooleanAsInteger {
    return {
        get,
        kind: 'adapt-boolean-as-integer'
    }
}

export interface ConvertToInteger {
    get: GetColumn
    kind: 'convert-to-integer'
}

export function createConvertToInteger(get: GetColumn): ConvertToInteger {
    return {
        get,
        kind: 'convert-to-integer'
    }
}