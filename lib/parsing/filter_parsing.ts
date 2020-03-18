import {
    aComparisonOperator,
    aBinaryLogicalOperator,
    createNamedObjectPropertyParser,
    closingParenthesis,
    openingParenthesis,
    joinWithWhitespace, createValueParser, aNumber, aString, joinWithDot
} from './javascript_parsing'
import {extractLambdaString} from '../lambda_string_extraction'
import normalizeQuotes from './quote_normalization'
import {
    escapeParenthesesInsideStrings,
    NestedSegment,
    parseParentheses,
    unescapeParenthesesInsideStrings
} from './parenthesis_parsing'
import * as A from 'arcsecond'
import * as getParameterNames from 'get-parameter-names'
import {Constant, createConstant, createGetFromParameter, GetFromParameter} from '../column_operations'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'

export type SqlComparisonOperator = '='|'>'|'>='|'<'|'<='
export type Side = Constant|GetFromParameter

export interface Comparison {
    left: Side,
    operator: SqlComparisonOperator,
    right: Side,
    kind: 'comparison'
}

export function createComparison(left: Side, operator: SqlComparisonOperator, right: Side): Comparison {
    return {
        left,
        operator: mapJsComparisonOperatorToSqlComparisonOperator(operator),
        right,
        kind: 'comparison'
    }
}

export function createEquality(left: Side, right: Side): Comparison {
    return createComparison(left, '=', right)
}

export function createGreaterThan(left: Side, right: Side): Comparison {
    return createComparison(left, '>', right)
}

export function createGreaterThanOrEqualTo(left: Side, right: Side): Comparison {
    return createComparison(left, '>=', right)
}

export function createLessThan(left: Side, right: Side): Comparison {
    return createComparison(left, '<', right)
}

export function createLessThanOrEqualTo(left: Side, right: Side): Comparison {
    return createComparison(left, '<=', right)
}

export interface InsideParentheses {
    inside: PredicateExpression
    kind: 'inside'
}

export function createInsideParentheses(inside: PredicateExpression): InsideParentheses {
    return {
        inside,
        kind: 'inside'
    }
}

export interface TailItem {
    operator: '&&'|'||',
    expression: PredicateExpression
    kind: 'tail-item'
}

export function createTailItem(operator: '&&'|'||', expression: PredicateExpression): TailItem {
    return {
        operator,
        expression,
        kind: 'tail-item'
    }
}

export function createAnd(expression: PredicateExpression): TailItem {
    return createTailItem('&&', expression)
}

export function createOr(expression: PredicateExpression): TailItem {
    return createTailItem('||', expression)
}

export interface Concatenation {
    head: PredicateExpression,
    tail: TailItem[],
    kind: 'concatenation'
}

export function createConcatenation(head: PredicateExpression, tail: TailItem[]): Concatenation {
    return {
        head,
        tail,
        kind: 'concatenation'
    }
}

export type PredicateExpression = InsideParentheses | Concatenation | Comparison

export interface Filter {
    parameterToTable: {[parameter: string]: string}
    predicate: PredicateExpression
}

export function createFilter(parameterToTable: {[parameter: string]: string}, predicate: PredicateExpression): Filter {
    return {
        parameterToTable,
        predicate
    }
}

export function createComparisonParser(valueParser, objectPropertyParser) {
    const valueOrObjectProperty = A.choice([valueParser, objectPropertyParser])

    return A.sequenceOf(
        [
            valueOrObjectProperty,
            A.optionalWhitespace,
            aComparisonOperator,
            A.optionalWhitespace,
            valueOrObjectProperty
        ])
        .map(([left, ws1, operator, ws2, right]) => ([left, operator, right]))
}

export function createTailItemsParser(side) {
    return A.many1(
        A.sequenceOf([
            A.optionalWhitespace,
            aBinaryLogicalOperator,
            A.optionalWhitespace,
            side
        ])
        .map(([ws1, operator, ws2, comparison]) => ([operator, comparison]))
    )
}

function createReverseTailItemParser(side) {
    return A.many1(
        A.sequenceOf([
            side,
            A.optionalWhitespace,
            aBinaryLogicalOperator,
            A.optionalWhitespace,
        ])
        .map(([comparison, ws1, operator, ws2]) => ([comparison, operator]))
    )
}

export function createConcatenationParser(head, tailItems) {
    return A.sequenceOf([
        head,
        tailItems
    ])
}

function mapJsComparisonOperatorToSqlComparisonOperator(operator): SqlComparisonOperator {
    switch (operator) {
        case '===':
        case '==':
            return '='
        default:
            return operator
    }
}

function createLeafParser(parameterNames) {
    const mapToComparisonObject = ([left, operator, right]) => createComparison(left, operator, right)

    const valueParser = createValueParser(aString.map(x => x.slice(1, x.length - 1)), aNumber).map(value => createConstant(value))
    const objectPropertyParser = createNamedObjectPropertyParser(parameterNames).map(([object, property]) => createGetFromParameter(object, property))
    const comparisonParser = createComparisonParser(valueParser, objectPropertyParser)
        .map(mapToComparisonObject)

    const tailItemsParser = createTailItemsParser(comparisonParser)
    const concatenationParser = createConcatenationParser(comparisonParser, tailItemsParser)
        .map(([ head, tailItems ]) => {
            const tail = tailItems.map(([ws1, operator, ws2, expression]) => {
                return {
                    operator,
                    expression: expression.map(mapToComparisonObject)
                }
            })

            return createConcatenation(head, tail)
        })


    const parser = A.choice([
        concatenationParser,
        comparisonParser
    ])

    return parser
}

function createSegmentParser(parameterNames: String[]): (segment: NestedSegment) => PredicateExpression {

    const leafParser = createLeafParser(parameterNames)

    function checkIfLeaf(segment: NestedSegment): boolean {
        return segment.length === 1 && typeof segment[0] === 'string'
    }

    function checkIfParentheses(segment: NestedSegment): boolean {
        return segment.length === 3 && segment[0] === '(' && segment[2] === ')'
    }

    function parseLeaf(segment: NestedSegment): Concatenation|Comparison {
        const result = leafParser.run(segment[0])
        return result.result
    }

    function parseInsideParentheses(segment: NestedSegment): InsideParentheses {
        const inside = parseSegment(segment)

        return createInsideParentheses(inside)
    }

    function parseHead(segment: NestedSegment): [PredicateExpression, number] {

        const firstSegment = segment[0]
        const secondSegment = segment[1]

        if (typeof firstSegment === 'string') {
            // Case 1: without parentheses
            // Ex.: ['e.id == 1', '&&']
            if (typeof secondSegment === 'string' && secondSegment === '&&' || secondSegment === '||') {
                return [parseSegment([firstSegment]), 1]
            }
            // Case 2: With parentheses
            // Ex.: ['(', [...], ')']
            else if (Array.isArray(secondSegment)) {
                return [parseInsideParentheses(secondSegment as NestedSegment), 3]
            }
        }

        throw Error(`Unsupported head segment: ${segment}`)
    }

    function parseTailItem(segment: NestedSegment, index: number): [TailItem, number] {
        const operator = segment[index]
        if (typeof operator !== 'string' || (operator !== '&&' && operator !== '||')) {
            throw Error(`Unsupported tail segment: ${segment}\nExpected a binary logical operator at position ${index}`)
        }

        const remainingSegments = segment.length-index-1
        const nextSegment = segment[index + 1]
        if (typeof nextSegment !== 'string') {
            throw Error(`Unsupported tail segment: ${segment}\\nExpected string at position ${index+1}`)
        }

        // [ '&&', '(', [..], ')' ]
        if (nextSegment === '(' && remainingSegments >= 3) {

            const arr = segment[index + 2]
            if (!Array.isArray(arr)) {
                throw Error(`Unsupported tail segment: ${segment}\\nExpected an array at position ${index+2}`)
            }

            const closingParenthesis = segment[index + 3]
            if (typeof closingParenthesis !== 'string' || closingParenthesis !== ')') {
                throw Error(`Unsupported tail segment: ${segment}\\nExpected closing parenthesis at position ${index+3}`)
            }

            return [createTailItem(operator, parseInsideParentheses(arr)), 4]
        }
        // [ '&&', 'e.id === 1' ]
        else {
            const expression = parseLeaf([nextSegment])

            return [createTailItem(operator, expression), 2]
        }
    }

    function parseTail(segment: NestedSegment, start: number): TailItem[] {
        const tail: TailItem[] = []

        let index = start

        while (index < segment.length-1) {
            const [item, addToIndex]  = parseTailItem(segment, index)
            
            tail.push(item)
            index += addToIndex
        }

        return tail
    }

    function parseSegment(segment: NestedSegment): PredicateExpression {
        // Leaf
        if (checkIfLeaf(segment)) {
            return parseLeaf(segment)
        }
        // Inside parentheses
        else if (checkIfParentheses(segment)) {
            return parseInsideParentheses(segment[1] as NestedSegment)
        }
        // Concatenation
        else {
            const [head, startTail] = parseHead(segment)
            const tail = parseTail(segment, startTail)

            return createConcatenation(head, tail)
        }
    }

    return parseSegment
}

function createBinaryLogicalOperatorSplitter(parameterNames: string[]): (segment: NestedSegment) => NestedSegment {
    const objectProperty = createNamedObjectPropertyParser(parameterNames).map(joinWithDot)
    const comparison = createComparisonParser(createValueParser(), objectProperty).map(joinWithWhitespace)
    const tailItems = createTailItemsParser(comparison).map(items => items.reduce((acc, item) => acc.concat(item)), [])
    const reverseTailItems = createReverseTailItemParser(comparison).map(items => items.reduce((acc, item) => acc.concat(item)), [])

    const parser = A.choice([
        // ) && (
        A.sequenceOf([closingParenthesis, A.optionalWhitespace, aBinaryLogicalOperator, A.optionalWhitespace, openingParenthesis])
            .map(([cp, ws1, operator, ws2, op]) => [')', operator, '(']),

        // ) && e.id === 1
        // ) && e.firstName === 'John' && e.lastName === 'Doe'
        A.sequenceOf([closingParenthesis, A.optionalWhitespace, tailItems])
            .map(([cp, ws, tailItems]) => [')'].concat(tailItems)),

        // e.id === '1' && (
        // e.firstName === 'John' && e.lastName === 'Doe && (
        A.sequenceOf([reverseTailItems, A.optionalWhitespace, openingParenthesis])
            .map(([reverse, ws, op]) => reverse.concat(['('])),

        // (
        // )
        A.choice([openingParenthesis, closingParenthesis])
            .map(parenthesis => [parenthesis]),

        // e.firstName === 'John' && e.lastName === 'Doe'
        A.sequenceOf([comparison, tailItems]).map(([head, tail]) => [head].concat(tail)),

        // e.id === 1
        comparison
    ])

    function split(segment: NestedSegment): NestedSegment {
        return segment.reduce<NestedSegment>((acc, item) => {

            if (Array.isArray(item)) {
                return acc.concat([split(item)])
            }
            else {
                const res = parser.run(item).result
                return acc.concat(res)
            }

        }, [])
    }

    return split
}

export function parsePredicate(f: Function, parameterNames: string[]): PredicateExpression {
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

    // Split up strings that contain binary operators
    const splitBinaryLogicalOperators = createBinaryLogicalOperatorSplitter(parameterNames)

    const preprocessedSegments = splitBinaryLogicalOperators(unescapedSegments)

    const parseSegment = createSegmentParser(parameterNames)

    const predicate = parseSegment(preprocessedSegments)

    return predicate
}

export function parseFilter(f: Function): Filter {
    const parameterNames = getParameterNames(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameterNames)

    const predicate = parsePredicate(f, parameterNames)

    return createFilter(parameterToTable, predicate)
}