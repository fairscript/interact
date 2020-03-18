import {
    createConstant,
    createGetFromParameter, createSubselect
} from '../column_operations'
import {
    aNumber,
    aString,
    closingBracket,
    closingParenthesis,
    comma,
    createChoiceFromStrings,
    createDictionaryParser,
    createKeyValuePairParser,
    createNamedObjectPropertyParser,
    createObjectPropertyParser,
    createValueParser,
    dot,
    identifier,
    openingBracket,
    openingParenthesis,
    semicolon
} from './javascript_parsing'
import * as A from 'arcsecond'
import {
    createComparison,
    createComparisonParser, createConcatenation, createFilter,
    createInsideParentheses, createTailItem,
    createTailItemsParser
} from './filter_parsing'
import {extractLambdaString} from '../lambda_string_extraction'
import * as getParameterNames from 'get-parameter-names'
import {createSubselectStatement} from '../select_statement'
import {createMapSelection, MapSelection} from './map_parsing'

function createPredicateExpressionParser() {
    const comparisonParser = createComparisonParser(
        createValueParser(aString.map(x => x.slice(1, x.length - 1)), aNumber).map(v => createConstant(v)),
        createObjectPropertyParser(identifier, identifier).map(([object, property]) => createGetFromParameter(object, property))
    ).map(([left, operator, right]) => createComparison(left, operator, right))

    const insideParser = A.recursiveParser(() => A.choice([concatenationParser, insideParenthesesParser, comparisonParser]))
    const insideParenthesesParser = A.sequenceOf([openingParenthesis, A.optionalWhitespace, insideParser, A.optionalWhitespace, closingParenthesis])
        .map(([op, ws1, inside, ws2, cp]) => createInsideParentheses(inside))

    const concatenationParser = A.sequenceOf([
        A.choice([insideParenthesesParser, comparisonParser]),
        createTailItemsParser(A.choice([insideParenthesesParser, comparisonParser]))
            .map(([operator, comparison]) => createTailItem(operator, comparison))
    ])
        .map(([head, tail]) => createConcatenation(head, tail))

    const predicateExpressionParser = A.choice([concatenationParser, insideParenthesesParser, comparisonParser])

    return predicateExpressionParser
}

const parameterList = A.sequenceOf([
    identifier,
    A.many(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace, identifier]).map(([ws1, c, ws2, parameter]) => parameter))
]).map(([head, tail]) => [head].concat(tail))

const functionSignature = A.sequenceOf([
    openingParenthesis,
    parameterList,
    closingParenthesis,
]).map(([op, parameters, cp]) => parameters)

function createFilterParser(predicateExpressionParser) {

    const functionBody = A.sequenceOf([
        openingBracket,
        A.optionalWhitespace,
        aReturn,
        A.optionalWhitespace,
        predicateExpressionParser,
        A.optionalWhitespace,
        semicolon,
        A.optionalWhitespace,
        closingBracket
    ]).map(([ob, ws1, ret, ws2, predicate, ws3, sc, ws4, cb]) => predicate)

    const filter = A.sequenceOf([
        A.str('filter'),
        openingParenthesis,
        createLambdaParser(functionBody),
        closingParenthesis
    ])

    return filter
}

const aReturn = A.str('return')

function createLambdaParser(functionBody) {
    return A.sequenceOf([
        A.str('function'),
        A.optionalWhitespace,
        functionSignature,
        A.optionalWhitespace,
        functionBody
    ])
    .map(([str, ws1, parameters, ws2, body]) => [parameters, body])
}

const count = A.str('count()')

function createSubselectParser(subtableParameterNames, filter) {
    return A.sequenceOf([
        createChoiceFromStrings(subtableParameterNames),
        A.many1(A.sequenceOf([dot, filter]).map(([dot, filter]) => filter)),
        dot,
        count])
}

function mapParameterToTable(parameters: string[], prefix: string): {[parameter: string]: string} {
    return parameters
        .map((p, i) => [p, prefix + (i+1)])
        .reduce(
            (acc, [parameter, tableAlias]) => {
                acc[parameter] = tableAlias
                return acc
            },
            {})
}

export function parseMapS(f: Function, subtableNames: string[]): MapSelection {
    const lambdaString = extractLambdaString(f)

    const parameterNames = getParameterNames(f)

    const subParameterNames = parameterNames.slice(0, subtableNames.length)
    const subParameterToTable = mapParameterToTable(subParameterNames, 's')

    const outerParameterNames = parameterNames.slice(subtableNames.length)
    const outerParameterToTable = mapParameterToTable(outerParameterNames, 't')

    const predicateExpressionParser = createPredicateExpressionParser()
    const filterParser = createFilterParser(predicateExpressionParser)
        .map(([name, op, [filterParameters, predicate], cp]) => [filterParameters, predicate])

    const getParser = createNamedObjectPropertyParser(outerParameterNames)
        .map(([object, property]) => {
            return createGetFromParameter(object, property)
        })

    const subselectParser = createSubselectParser(subParameterNames, filterParser)
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

    const dictionaryValueParser = A.choice([
        getParser,
        subselectParser
    ])

    const keyValuePair = createKeyValuePairParser(dictionaryValueParser)

    const parser = createDictionaryParser(keyValuePair)

    const result = parser.run(lambdaString).result

    return createMapSelection(outerParameterToTable, result)
}