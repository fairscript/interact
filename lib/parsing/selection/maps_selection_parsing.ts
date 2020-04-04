import * as A from 'arcsecond'
import {createSubselectStatement} from '../../select_statement'
import {createMapSelection, MapSelection} from './map_selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {createRecordInParenthesesParser} from '../javascript/record_parsing'
import {createParameterlessFilter} from '../filtering/parameterless_filter_parsing'
import {createSubselectParser} from './subselection_parsing'
import {createGetColumnParser} from '../value_expressions/get_column_parsing'

export function parseMapWithSubquerySelection(f: Function, subtableNames: string[]): MapSelection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const subParameterNames = parameters.slice(0, subtableNames.length)
    const subParameterToTableAlias = mapParameterNamesToTableAliases(subParameterNames, 's')

    const outerParameterNames = parameters.slice(subtableNames.length)
    const outerParameterToTableAlias = mapParameterNamesToTableAliases(outerParameterNames, 't')

    const getColumnParser = createGetColumnParser(outerParameterNames)
    const subselectParser = createSubselectParser(subParameterNames, outerParameterNames)

    const choiceBetweenValueParsers = A.choice([
        getColumnParser,
        subselectParser
            .chain(([parsedSubtableParameter, parsedFilterInvocations, parsedSelection]) => {

                // Map the table parameter used in the outer function to the table name in the database
                const indexOfSubtable = subParameterNames.indexOf(parsedSubtableParameter)
                const subtableName = subtableNames[indexOfSubtable]

                const filters = parsedFilterInvocations
                    .map(([parameter, predicate]) => {
                        const innerParameterToTableAlias = {
                            [parameter]: subParameterToTableAlias[parsedSubtableParameter]
                        }

                        return createParameterlessFilter(
                            {
                                ...outerParameterToTableAlias,
                                ...innerParameterToTableAlias
                            },
                            predicate)
                    })

                const statement = createSubselectStatement(subtableName, filters, parsedSelection)

                return A.succeedWith(statement)
            })
    ])

    const parser = createRecordInParenthesesParser(choiceBetweenValueParsers)

    const result = parser.run(expression).result

    return createMapSelection(outerParameterToTableAlias, result)
}