import {GetColumn} from './value_expressions/get_column_parsing'

export interface ImplicitlyConvertBooleanToInteger {
    get: GetColumn
    kind: 'implicitly-convert-boolean-to-integer'
}

export function createImplicitlyConvertBooleanToInteger(get: GetColumn): ImplicitlyConvertBooleanToInteger {
    return {
        get,
        kind: 'implicitly-convert-boolean-to-integer'
    }
}