import {mapParameterNamesToTableAliases} from '../generation/table_aliases'
import {parsePredicate, PredicateExpression} from './predicate_parsing'
import {parseLambdaFunction} from './lambda_parsing'

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
    const { parameters } = parseLambdaFunction(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameters)

    const predicate = parsePredicate(f)

    return createFilter(parameterToTable, predicate)
}
