import {createGetFromParameter, createSubselect} from '../../column_operations'
import {
    closingBracket,
    closingParenthesis,
    createChoiceFromStrings,
    createDictionaryParser, createFunctionBody,
    createKeyValuePairParser, createLambdaParser,
    createNamedObjectPropertyParser, createParameterlessFunctionInvocation,
    dot,
    openingParenthesis,
} from '../javascript_parsing'
import * as A from 'arcsecond'
import {extractLambdaString} from '../../lambda_string_extraction'
import * as getParameterNames from 'get-parameter-names'
import {createSubselectStatement} from '../../select_statement'
import {createGetFromParameterParser, createMapSelection, MapSelection} from './map_parsing'
import {createFilter} from '../filter_parsing'
import {createPredicateExpressionParser} from '../predicate_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'



function createFilterParser() {
    const predicateExpressionParser = createPredicateExpressionParser()

    const functionBody = createFunctionBody(predicateExpressionParser)
        .map(([ob, ws1, ret, ws2, predicate, ws3, sc, ws4, cb]) => predicate)

    return A.sequenceOf([
        A.str('filter'),
        openingParenthesis,
        createLambdaParser(functionBody),
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
    const lambdaString = extractLambdaString(f)

    const parameterNames = getParameterNames(f)

    const subParameterNames = parameterNames.slice(0, subtableNames.length)
    const subParameterToTable = mapParameterNamesToTableAliases(subParameterNames, 's')

    const outerParameterNames = parameterNames.slice(subtableNames.length)
    const outerParameterToTable = mapParameterNamesToTableAliases(outerParameterNames, 't')

    const getParser = createGetFromParameterParser(outerParameterNames)
    const subselectParser = createSubselectParser(subtableNames, subParameterNames, subParameterToTable, outerParameterToTable)

    const dictionaryValueParser = A.choice([
        getParser,
        subselectParser
    ])

    const keyValuePair = createKeyValuePairParser(dictionaryValueParser)

    const parser = createDictionaryParser(keyValuePair)

    const result = parser.run(lambdaString).result

    return createMapSelection(outerParameterToTable, result)
}