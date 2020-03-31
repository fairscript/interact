import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {ValueOrNestedValueRecord} from '../../record'
import {createPredicateParser, parsePredicate, Predicate} from '../predicates/predicate_parsing'
import {createParameterizedSideParser} from '../predicates/side_parsing'

export interface ParameterizedFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    predicate: Predicate
    userProvided: ValueOrNestedValueRecord
    kind: 'parameterized-filter'
}

export function createParameterizedFilter(
    tableParameterToTableAlias: { [p: string]: string },
    predicate: Predicate,
    userProvided: ValueOrNestedValueRecord): ParameterizedFilter {

    return {
        tableParameterToTableAlias,
        predicate,
        userProvided,
        kind: 'parameterized-filter'
    }
}

export function parseParameterizedFilter(f: Function, prefix: string, userProvided: ValueOrNestedValueRecord): ParameterizedFilter {
    const {parameters, expression} = extractLambdaParametersAndExpression(f)

    const userProvidedParameter = parameters[0]
    const tableParameters = parameters.slice(1)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(tableParameters)

    const parser = createPredicateParser(createParameterizedSideParser(prefix, userProvidedParameter, tableParameters))

    const predicate = parsePredicate(parser, expression)

    return createParameterizedFilter(tableParameterToTableAlias, predicate, userProvided)
}