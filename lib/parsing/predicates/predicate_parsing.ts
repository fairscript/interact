import * as A from 'arcsecond'
import normalizeQuotes from '../quote_normalization'
import {createInsideParentheses, InsideParentheses} from './inside_parentheses'
import {Concatenation, createConcatenation, createTailItem, createTailParser} from './concatenation'
import {Comparison, createComparison, createEqual, Side} from './comparisons'
import {createComparisonParser} from './comparison_parsing'
import {closingParenthesis, openingParenthesis} from '../javascript/single_character_parsing'
import {
    Constant,
    createConstant,
    createConstantSideParser,
    createParameterizedSideParser,
    createParameterlessSideParser
} from './side_parsing'
import {createGetColumnParser, GetColumn} from '../get_column_parsing'
import {createGetProvidedParser, GetProvided} from '../get_provided_parsing'
import {
    createConstantBooleanValueEvaluationParser,
    createParameterizedBooleanValueEvaluationParser,
    createParameterlessBooleanValueEvaluationParser
} from './boolean_value_evaluation_parsing'
import {createNegationParser, Negation} from './negation_parsing'

function createConcatenationParser(concatenationItem) {
    return A.sequenceOf([
        concatenationItem,
        createTailParser(concatenationItem)
            .map(items => items.map(([operator, expression]) => createTailItem(operator, expression)))
    ])
        .map(([head, tail]) => createConcatenation(head, tail))
}

function createInsideParenthesesParser(inside) {
    const positive = A.sequenceOf([openingParenthesis, A.optionalWhitespace, inside, A.optionalWhitespace, closingParenthesis])
        .map(([op, ws1, inside, ws2, cp]) => createInsideParentheses(inside))

    const negative = createNegationParser(positive)

    return A.choice([positive, negative])
}

export function createPredicateParser(sideDataParser, booleanValueEvaluation) {
    const insideOnSide = A.recursiveParser(() => A.choice([concatenation, comparison, insideParenthesesOnSide, sideDataParser]))
    const insideParenthesesOnSide = createInsideParenthesesParser(insideOnSide)

    const comparison = createComparisonParser(A.choice([insideParenthesesOnSide, sideDataParser]))
        .map(([left, operator, right]) => createComparison(left, operator, right))

    const inside = A.recursiveParser(() => A.choice([
        concatenation,
        comparison,
        insideParentheses,
        booleanValueEvaluation
    ]))
    const insideParentheses = createInsideParenthesesParser(inside)

    const concatenationItem = A.choice([
        comparison,
        insideParentheses,
        booleanValueEvaluation
    ])
    const concatenation = createConcatenationParser(concatenationItem)

    return A.choice([
        concatenation,
        comparison,
        insideParentheses,
        booleanValueEvaluation
    ])
}

// GetColumn, GetProvided and Constant can refer to boolean columns/parameters/values and are, thus, predicates.
export type Predicate = InsideParentheses | Concatenation | Comparison | Negation | GetColumn | GetProvided | Constant

export function parsePredicateExpression(parser, expression: string) {
    // Replace double quotes around string with single quotes
    const withNormalizedQuotes = normalizeQuotes(expression)

    return parser.run(withNormalizedQuotes).result
}

function createConstantPredicateParser() {
    const sideParser = createConstantSideParser()
    const booleanValueEvaluationParser = createConstantBooleanValueEvaluationParser()

    return createPredicateParser(sideParser, booleanValueEvaluationParser)
}

export function createParameterlessParser(tableParameters: string[]) {
    if (tableParameters.length > 0) {
        const getColumnParser = createGetColumnParser(tableParameters)
        const sideParser = createParameterlessSideParser(getColumnParser)
        const booleanValueEvaluationParser = createParameterlessBooleanValueEvaluationParser(getColumnParser)

        return createPredicateParser(sideParser, booleanValueEvaluationParser)
    }
    else {
        return createConstantPredicateParser()
    }
}

export function parseParameterlessPredicate(tableParameters: string[], expression: string): Predicate {
    const parser = createParameterlessParser(tableParameters)
    return parsePredicateExpression(parser, expression)
}

export function createParameterizedParser(prefix: string, userProvidedParameter: string, tableParameters: string[]) {
    const getProvidedParser = createGetProvidedParser(prefix, userProvidedParameter)
    const getColumnParser =  tableParameters.length > 0 ? createGetColumnParser(tableParameters) : null

    const sideParser = createParameterizedSideParser(getProvidedParser, getColumnParser)
    const booleanValueEvaluationParser = createParameterizedBooleanValueEvaluationParser(getProvidedParser, getColumnParser)

    return createPredicateParser(sideParser, booleanValueEvaluationParser)
}

export function parseParameterizedPredicate(prefix: string, userProvidedParameter: string, tableParameters: string[], expression: string) {
    if (userProvidedParameter === null) {
        return createConstantPredicateParser()
    }
    else {
        const parser = createParameterizedParser(prefix, userProvidedParameter, tableParameters)
        return parsePredicateExpression(parser, expression)
    }
}