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
import * as A from 'arcsecond'

function createPredicateParser<T>(f: (x: T) => boolean) {
    const tableField = createTableFieldParser(f)

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
    // Create the parser for the given function
    const parser = createPredicateParser(f)

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