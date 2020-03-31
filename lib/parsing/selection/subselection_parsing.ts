import * as A from 'arcsecond'

import {createChoiceFromStrings} from '../parsing_helpers'
import {closingParenthesis, dot, openingParenthesis} from '../javascript/single_character_parsing'
import {
    createOneParameterFunctionInvocation,
    createParameterlessFunctionInvocation
} from '../javascript/invocation_parsing'
import {createLambdaParser, createLambdaBodyParser, lambdaSignatureParser} from '../javascript/lambda_parsing'
import {createConstantOrColumnSideParser, createPredicateExpressionParser} from '../filter_parsing'
import {createCountOperation} from '../count_operation_parsing'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'
import {identifier} from '../javascript/identifier_parsing'
import {
    AggregationFunction,
    createAggregateColumn,
    jsToSqlAggregationFunction
} from '../aggregation/aggregate_column_parsing'
import {createGetColumn} from '../../column_operations'
import {createGetColumnParser} from '../get_column_parsing'
import {createSingleColumnSelection} from './single_column_selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {createCountSelection} from './count_selection'

// filter(function (se) { return se.salary > e.salary; })
function createFilterParser(outerParameterNames) {
    return A.coroutine(function* () {
        yield A.str('filter')

        yield openingParenthesis

        const innerParameterName = (yield lambdaSignatureParser)[0]

        yield A.optionalWhitespace

        const sideParser = createConstantOrColumnSideParser(outerParameterNames.concat(innerParameterName))
        const predicateParser = createPredicateExpressionParser(sideParser)

        const predicate = yield createLambdaBodyParser(predicateParser)

        yield closingParenthesis

        return [innerParameterName, predicate]
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
    const aggregationFunction = jsToSqlAggregationFunction[methodName]
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