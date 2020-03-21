import {createSubselect} from '../../column_operations'
import * as A from 'arcsecond'
import {createSubselectStatement} from '../../select_statement'
import {createGetFromParameterParser, createMapSelection, MapSelection} from './map_parsing'
import {createFilter} from '../filter_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {
    createLambdaBodyParser,
    lambdaSignatureParser,
    extractLambdaParametersAndExpression
} from '../javascript/lambda_parsing'
import {createParameterlessFunctionInvocation} from '../javascript/invocation_parsing'
import {createRecordInParenthesesParser} from '../javascript/record_parsing'
import {closingParenthesis, dot, openingParenthesis} from '../javascript/single_character_parsing'
import {createChoiceFromStrings} from '../parsing_helpers'
import {createPredicateExpressionParser} from '../predicate_parsing'

// filter(function (se) { return se.salary > e.salary; })
const filterParser = A.coroutine(function *() {
    yield A.str('filter')

    yield openingParenthesis

    const parameters = yield lambdaSignatureParser

    yield A.optionalWhitespace

    const predicate = yield createLambdaBodyParser(createPredicateExpressionParser())

    yield closingParenthesis

    return [parameters[0], predicate]
})

// .filter(function (se) { return se.salary > e.salary; })
// .filter(function (se) { return se => se.departmentId === e.departmentId; })
const manyFiltersParser = A.many(
    A.coroutine(function*() {
        yield dot

        return yield filterParser
    })
)

const countParser = createParameterlessFunctionInvocation('count')

// st
//     .filter(function (se) { return se.salary > e.salary; })
//     .filter(function (se) { return se => se.departmentId === e.departmentId; })
//     .count()
function createSubselectParser(availableSubtableParameters: string[]) {
    return A.coroutine(function*() {
        const subtableParameter = yield createChoiceFromStrings(availableSubtableParameters)

        const filters = yield manyFiltersParser

        yield dot
        yield countParser

        return [subtableParameter, filters]
    })
}

export function parseMapS(f: Function, subtableNames: string[]): MapSelection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const subParameterNames = parameters.slice(0, subtableNames.length)
    const subParameterToTableAlias = mapParameterNamesToTableAliases(subParameterNames, 's')

    const outerParameterNames = parameters.slice(subtableNames.length)
    const outerParameterToTableAlias = mapParameterNamesToTableAliases(outerParameterNames, 't')

    const getParser = createGetFromParameterParser(outerParameterNames)
    const subselectParser = createSubselectParser(subParameterNames)

    const choiceBetweenValueParsers = A.choice([
        getParser,
        subselectParser
            .chain(([parsedSubtableParameter, parsedFilterInvocations]) => {

                // Map the table parameter used in the outer function to the table name in the database
                const indexOfSubtable = subParameterNames.indexOf(parsedSubtableParameter)
                const subtableName = subtableNames[indexOfSubtable]

                const filters = parsedFilterInvocations
                    .map(([parameter, predicate]) => {
                        const innerParameterToTableAlias = {
                            [parameter]: subParameterToTableAlias[parsedSubtableParameter]
                        }

                        return createFilter(
                            {
                                ...outerParameterToTableAlias,
                                ...innerParameterToTableAlias
                            },
                            predicate)
                    })

                const statement = createSubselectStatement(subtableName, filters)

                return A.succeedWith(createSubselect(statement))
            })
    ])

    const parser = createRecordInParenthesesParser(choiceBetweenValueParsers)

    const result = parser.run(expression).result

    return createMapSelection(outerParameterToTableAlias, result)
}