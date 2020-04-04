import * as A from 'arcsecond'

import {createChoiceFromStrings} from '../parsing_helpers'
import {closingParenthesis, dot, openingParenthesis} from '../javascript/single_character_parsing'
import {
    createOneParameterFunctionInvocation,
    createParameterlessFunctionInvocation
} from '../javascript/invocation_parsing'
import {createLambdaBodyParser, createLambdaParser, lambdaSignatureParser} from '../javascript/lambda_parsing'
import {
    createAggregateColumn,
    mapLibraryAggregateFunctionNameToSqlFunctionName
} from '../aggregation/aggregate_column_parsing'
import {createGetColumnParser} from '../value_expressions/get_column_parsing'
import {createSingleColumnSelection} from './single_column_selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {createCountSelection} from './count_selection'
import {createBooleanExpressionParser} from '../boolean_expressions/boolean_expression_parsing'
import {createParameterlessValueExpressionParser} from '../value_expressions/value_expression_parsing'
import {createParameterlessBooleanValueEvaluationParser} from '../boolean_expressions/boolean_value_evaluation_parsing'

// filter(function (se) { return se.salary > e.salary; })
function createFilterParser(outerParameterNames) {
    return A.coroutine(function* () {
        yield A.str('filter')

        yield openingParenthesis

        const innerParameterName = (yield lambdaSignatureParser)[0]

        yield A.optionalWhitespace

        const outerAndInnerParameterNames = outerParameterNames.concat(innerParameterName)
        const getColumnParser = createGetColumnParser(outerAndInnerParameterNames)

        const sideParser = createParameterlessValueExpressionParser(getColumnParser)
        const booleanValueEvaluationParser = createParameterlessBooleanValueEvaluationParser(getColumnParser)
        const booleanExpressionParser = createBooleanExpressionParser(sideParser, booleanValueEvaluationParser)

        const booleanExpression = yield createLambdaBodyParser(booleanExpressionParser)

        yield closingParenthesis

        return [innerParameterName, booleanExpression]
    })
}


// .filter(function (se) { return se.salary > e.salary; })
// .filter(function (se) { return se => se.departmentId === e.departmentId; })
function createManyFiltersParser(outerParameterNames) {
    const filterParser = createFilterParser(outerParameterNames)

    return A.many(
        A.coroutine(function*() {
            yield dot

            return yield filterParser
        })
    )
}

const countMethodParser = createParameterlessFunctionInvocation('count')
    .map(() => createCountSelection())

function createAggregationMethodParser(methodName: string) {
    const aggregationFunction = mapLibraryAggregateFunctionNameToSqlFunctionName(methodName)
    return createOneParameterFunctionInvocation(methodName, createLambdaParser(([parameter]) => createLambdaBodyParser(createGetColumnParser([parameter]))))
        .map(([_, [parameter, getColumn]]) => {
            const parameterNameToTableAlias = mapParameterNamesToTableAliases([parameter], 's')
            const aggregateColumn = createAggregateColumn(aggregationFunction, getColumn)

            return createSingleColumnSelection(parameterNameToTableAlias, aggregateColumn)
        })
}

const aggregationMethodParser = A.choice((['max', 'min', 'average', 'sum']).map(createAggregationMethodParser))

const subselectOperationParser = A.choice([countMethodParser, aggregationMethodParser])

// st
//     .filter(function (se) { return se.salary > e.salary; })
//     .filter(function (se) { return se => se.departmentId === e.departmentId; })
//     .count()
export function createSubselectParser(availableSubtableParameters: string[], outerParameterNames: string[]) {
    return A.coroutine(function* () {
        const subtableParameter = yield createChoiceFromStrings(availableSubtableParameters)

        const filters = yield createManyFiltersParser(outerParameterNames)

        yield dot

        const operation = yield subselectOperationParser

        return [subtableParameter, filters, operation]
    })
}