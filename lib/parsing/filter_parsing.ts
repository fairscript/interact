import * as getParameterNames from 'get-parameter-names'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'
import {parsePredicate, PredicateExpression} from './predicate_parsing'

export interface Filter {
    parameterToTable: {[parameter: string]: string}
    predicate: PredicateExpression
}

export function createFilter(parameterToTable: {[parameter: string]: string}, predicate: PredicateExpression): Filter {
    return {
        parameterToTable,
        predicate
    }
}

export function parseFilter(f: Function): Filter {
    const parameterNames = getParameterNames(f)
    const parameterToTable = mapParameterNamesToTableAliases(parameterNames)

    const predicate = parsePredicate(f)

    return createFilter(parameterToTable, predicate)
}
