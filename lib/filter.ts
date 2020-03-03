import {
    comparisonOperators,
    logicalOperators,
    createTableFieldParser,
    parseSegments,
    value,
    join,
    openingParenthesis, closingParenthesis
} from './parsing'
import {extractLambdaString} from './lambda_string'
import normalizeQuotes from './quote_normalization'
import {escapeParenthesesInsideStrings, parseParentheses, unescapeParenthesesInsideStrings} from './parenthesis_parsing'
import computeTableAliases from './table_aliases'
import * as getParameterNames from 'get-parameter-names'
import * as A from 'arcsecond'

function createPredicateParser(aliases: { [parameter: string]: string }) {
    const tableField = createTableFieldParser(aliases)

    const comparison = A.sequenceOf(
        [
            tableField,
            A.optionalWhitespace,
            comparisonOperators,
            A.optionalWhitespace,
            value
        ]).map(join)

    const head = comparison

    const tail = A.many(
        A.sequenceOf([
            A.optionalWhitespace,
            logicalOperators,
            A.optionalWhitespace,
            comparison
        ]).map(join)
    ).map(join)

    const logicalOperation = A.sequenceOf([
        head,
        tail
    ]).map(join)

    return A.choice([
        openingParenthesis,
        A.sequenceOf([A.optionalWhitespace, logicalOperators, A.optionalWhitespace]).map(join),
        logicalOperation,
        closingParenthesis])
}

export function parsePredicate<T>(f: (x: T) => boolean): string {
    // Extract the string containing the lambda
    const lambdaString = extractLambdaString(f)

    // Replace double quotes around string with single quotes
    const withNormalizedQuotes = normalizeQuotes(lambdaString)

    // Escape parentheses inside strings
    const [positionsOfParentheses, escapedLambdaString] = escapeParenthesesInsideStrings(withNormalizedQuotes)

    // Create a nested array of clauses
    const escapedSegments = parseParentheses(escapedLambdaString)

    // Unescape parentheses inside strings
    const unescapedSegments = unescapeParenthesesInsideStrings(escapedSegments, positionsOfParentheses)

    // Extract the parameter names from the function
    const parameterNames = getParameterNames(f)

    // Compute a dictionary that maps parameter names to table aliases
    const tableAliases = computeTableAliases(parameterNames)

    // Using this dictionary, create the parser
    const parser = createPredicateParser(tableAliases)

    // Apply the parser
    const predicate = parseSegments(parser, unescapedSegments)

    return predicate
}

export function generateFilter<T>(predicates: Array<(x: T) => boolean>) {
    const predicate = predicates.length == 1
        ? parsePredicate(predicates[0])
        : predicates.map(parsePredicate).map(predicate => '(' + predicate + ')').join(' AND ')

    return 'WHERE ' + predicate
}