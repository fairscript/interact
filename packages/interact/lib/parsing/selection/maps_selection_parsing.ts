import * as A from 'arcsecond'
import {createSubselectStatement} from '../../statements/subselect_statement'
import {createMapSelection, MapSelection} from './map_selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {extractLambdaParametersAndExpression} from '../functions/lambda_parsing'
import {createRecordInParenthesesParser} from '../literals/record_parsing'
import {createParameterlessFilter} from '../filtering/parameterless_filter_parsing'
import {createSubselectParser} from './subselection_parsing'
import {createGetColumnParser} from '../value_expressions/get_column_parsing'
import {ColumnTypeRecord} from '../../record'

export function parseMapWithSubquerySelection(subtableName: string, columns: ColumnTypeRecord, f: Function): MapSelection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const subParameterNames = [parameters[0]]
    const subParameterToTableAlias = mapParameterNamesToTableAliases(subParameterNames, 's')

    const outerParameterNames = parameters.slice(1)
    const outerParameterToTableAlias = mapParameterNamesToTableAliases(outerParameterNames, 't')

    const getColumnParser = createGetColumnParser(outerParameterNames)
    const subselectParser = createSubselectParser(subParameterNames, outerParameterNames)

    const choiceBetweenValueParsers = A.choice([
        getColumnParser,
        subselectParser
            .chain(([parsedSubtableParameter, parsedFilterInvocations, parsedSelection]) => {

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

                const statement = createSubselectStatement(subtableName, columns, filters, parsedSelection)

                return A.succeedWith(statement)
            })
    ])

    const parser = createRecordInParenthesesParser(choiceBetweenValueParsers)

    const result = parser.run(expression).result

    return createMapSelection(outerParameterToTableAlias, result)
}