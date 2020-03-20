import {createSubselect} from '../../column_operations'
import {
    closingParenthesis,
    createChoiceFromStrings,
    createDictionaryParser, createKeyValuePairParser, createLambdaParser,
    createParameterlessFunctionInvocation,
    dot,
    openingParenthesis,
} from '../javascript_parsing'
import * as A from 'arcsecond'
import {createSubselectStatement} from '../../select_statement'
import {createGetFromParameterParser, createMapSelection, MapSelection} from './map_parsing'
import {createFilter} from '../filter_parsing'
import {createPredicateExpressionParser} from '../predicate_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {parseLambdaFunction} from '../lambda_parsing'

function createFilterParser() {
    return A.sequenceOf([
        A.str('filter'),
        openingParenthesis,
        createLambdaParser(createPredicateExpressionParser()),
        closingParenthesis
    ])
}

const count = createParameterlessFunctionInvocation('count')

function createSubselectParser(
    subtableNames: string[],
    subParameterNames: string[],
    subParameterToTable: { [parameterName: string]: string },
    outerParameterToTable: { [parameterName: string]: string }) {

    const filterParser = createFilterParser()
        .map(([name, op, [filterParameters, predicate], cp]) => [filterParameters, predicate])

    return A.sequenceOf([
        createChoiceFromStrings(subParameterNames),
        A.many(A.sequenceOf([dot, filterParser]).map(([dot, filter]) => filter)),
        dot,
        count])
        .map(([subtableParameter, filterResults, d2, count]) => {

            const indexOfSubtable = subParameterNames.indexOf(subtableParameter)
            const subtableName = subtableNames[indexOfSubtable]

            const statement = createSubselectStatement(
                subtableName,
                filterResults.map(([parameters, predicate]) => {

                    return createFilter(
                        {
                            ...outerParameterToTable,
                            [parameters[0]]: subParameterToTable[subtableParameter]
                        },
                        predicate)
                }))

            return createSubselect(statement)
        })
}

export function parseMapS(f: Function, subtableNames: string[]): MapSelection {
    const { parameters, expression } = parseLambdaFunction(f)

    const subParameterNames = parameters.slice(0, subtableNames.length)
    const subParameterToTable = mapParameterNamesToTableAliases(subParameterNames, 's')

    const outerParameterNames = parameters.slice(subtableNames.length)
    const outerParameterToTable = mapParameterNamesToTableAliases(outerParameterNames, 't')

    const getParser = createGetFromParameterParser(outerParameterNames)
    const subselectParser = createSubselectParser(subtableNames, subParameterNames, subParameterToTable, outerParameterToTable)

    const dictionaryValueParser = A.choice([
        getParser,
        subselectParser
    ])

    const keyValuePair = createKeyValuePairParser(dictionaryValueParser)

    const parser = createDictionaryParser(keyValuePair)

    const result = parser.run(expression).result

    return createMapSelection(outerParameterToTable, result)
}