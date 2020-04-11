import * as A from 'arcsecond'
import normalizeQuotes from '../quote_normalization'
import {createInsideParentheses, InsideParentheses} from './inside_parentheses'
import {Concatenation, createConcatenation, createTailItem, createTailParser} from './concatenation'
import {Comparison, createComparison} from './comparisons'
import {createComparisonParser} from './comparison_parsing'
import {closingParenthesis, openingParenthesis} from '../literals/single_character_parsing'
import {
    literalValueExpressionParser,
    createParameterizedValueExpressionParser,
    createParameterlessValueExpressionParser
} from '../value_expressions/value_expression_parsing'
import {createGetColumnParser, GetColumn} from '../value_expressions/get_column_parsing'
import {createGetProvidedParser, GetProvided} from '../value_expressions/get_provided_parsing'
import {
    createLiteralBooleanValueEvaluationParser,
    createParameterizedBooleanValueEvaluationParser,
    createParameterlessBooleanValueEvaluationParser
} from './boolean_value_evaluation_parsing'
import {createNegationParser, Negation} from './negation_parsing'
import {Literal} from '../literals/literal'

// GetColumn, GetProvided and Literal can refer to boolean columns/parameters/values and are, thus, boolean expressions.
export type BooleanExpression = InsideParentheses | Concatenation | Comparison | Negation | GetColumn | GetProvided | Literal

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

export function createBooleanExpressionParser(valueExpressionParser, booleanValueEvaluation) {
    const valueInside = A.recursiveParser(() => A.choice([concatenation, comparison, valueInsideParentheses, valueExpressionParser]))
    const valueInsideParentheses = createInsideParenthesesParser(valueInside)

    const comparison = createComparisonParser(A.choice([valueInsideParentheses, valueExpressionParser]))
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

export function parseBooleanExpression(parser, expression: string) {
    // Replace double quotes around string with single quotes
    const withNormalizedQuotes = normalizeQuotes(expression)

    return parser.run(withNormalizedQuotes).result
}

function createLiteralBooleanExpressionParser() {
    const booleanValueEvaluationParser = createLiteralBooleanValueEvaluationParser()

    return createBooleanExpressionParser(literalValueExpressionParser, booleanValueEvaluationParser)
}

export function createParameterlessBooleanExpressionParser(tableParameters: string[]) {
    if (tableParameters.length > 0) {
        const getColumnParser = createGetColumnParser(tableParameters)
        const valueExpressionParser = createParameterlessValueExpressionParser(getColumnParser)
        const booleanValueEvaluationParser = createParameterlessBooleanValueEvaluationParser(getColumnParser)

        return createBooleanExpressionParser(valueExpressionParser, booleanValueEvaluationParser)
    }
    else {
        return createLiteralBooleanExpressionParser()
    }
}

export function parseParameterlessBooleanExpression(tableParameters: string[], expression: string): BooleanExpression {
    const parser = createParameterlessBooleanExpressionParser(tableParameters)
    return parseBooleanExpression(parser, expression)
}

export function createParameterizedBooleanExpressionParser(prefix: string, userProvidedParameter: string, tableParameters: string[]) {
    const getProvidedParser = createGetProvidedParser(prefix, userProvidedParameter)
    const getColumnParser =  tableParameters.length > 0 ? createGetColumnParser(tableParameters) : null

    const valueExpressionParser = createParameterizedValueExpressionParser(getProvidedParser, getColumnParser)
    const booleanValueEvaluationParser = createParameterizedBooleanValueEvaluationParser(getProvidedParser, getColumnParser)

    return createBooleanExpressionParser(valueExpressionParser, booleanValueEvaluationParser)
}

export function parseParameterizedBooleanExpression(prefix: string, userProvidedParameter: string, tableParameters: string[], expression: string) {
    if (userProvidedParameter === null) {
        return createLiteralBooleanExpressionParser()
    }
    else {
        const parser = createParameterizedBooleanExpressionParser(prefix, userProvidedParameter, tableParameters)
        return parseBooleanExpression(parser, expression)
    }
}