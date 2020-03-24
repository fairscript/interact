import * as A from 'arcsecond'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    createConstantOrColumnSideParser,
    createPredicateExpressionParser, Filter, parsePredicate,
    PredicateExpression
} from '../filter_parsing'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'
import {identifier} from '../javascript/identifier_parsing'
import {createGetProvided, GetProvided} from '../../column_operations'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

function createParameterSideParser(prefix: string, placeholderParameter: string) {
    return A.choice([
        createNamedObjectPropertyParser([placeholderParameter], identifier)
            .map(([object, property]) => createGetProvided(prefix, object, property)),
        A.str(placeholderParameter)
            .map(() => createGetProvided(prefix, placeholderParameter, null)),
    ])
}

function parseParameterizedPredicate(prefix: string, placeholderParameter: string|null, tableParameters: string[], expression: string): PredicateExpression {
    const parameterSideParser = createParameterSideParser(prefix, placeholderParameter)
    const constantOrColumnSideParser = createConstantOrColumnSideParser(tableParameters)

    const parser = createPredicateExpressionParser(A.choice([parameterSideParser, constantOrColumnSideParser]))

    return parsePredicate(parser, expression)
}

function findGetProvided(expression: PredicateExpression, collection: GetProvided[] = []): GetProvided[] {
    switch (expression.kind) {
        case 'concatenation':
            const { head, tail } = expression

            return tail.reduce(
                (acc, tailItem) => findGetProvided(tailItem.expression, acc),
                findGetProvided(head, collection))

        case 'inside':
            return findGetProvided(expression.inside, collection)
        case 'comparison':
            const { left, right } = expression

            const comparisonItems = []

            if (left.kind === 'get-provided') {
                comparisonItems.push(left)
            }

            if (right.kind === 'get-provided') {
                comparisonItems.push(right)
            }

            return collection.concat(comparisonItems)
    }
}

export function parseParameterizedFilter<P>(f: Function, userProvidedParameter: P, prefix: string): Filter {
    const {parameters, expression} = extractLambdaParametersAndExpression(f)

    const placeholderParameter = parameters[0]
    const tableParameters = parameters.slice(1)

    const predicate = parseParameterizedPredicate(prefix, placeholderParameter, tableParameters, expression)

    const getProvided = findGetProvided(predicate)

    const filterParameters = getProvided.reduce(
        (acc, item) => {

            const { prefix, path } = item

            if (path === null) {
                acc[`$${prefix}_${placeholderParameter}`] = userProvidedParameter
            }
            else {
                acc[`$${prefix}_${placeholderParameter}_${path}`] = userProvidedParameter[path]
            }

            return acc
        },
        {})

    return {
        tableParameterToTableAlias: mapParameterNamesToTableAliases(tableParameters),
        predicate: predicate,
        parameters: filterParameters
    }
}