import {
    comparisonOperators,
    binaryLogicalOperators,
    createObjectPropertyParser,
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
import {Value} from '../column_operations'

export interface ObjectProperty {
    object: string,
    property: string,
}

export interface Comparison {
    left: ObjectProperty,
    operator: '=',
    right: Value,
    kind: 'comparison'
}

export function createComparison(left: ObjectProperty, operator: '=', right: Value): Comparison {
    return {
        left,
        operator,
        right,
        kind: 'comparison'
    }
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

function createComparisonParser(objectPropertyParser, valueParser) {
    return A.sequenceOf(
        [
            objectPropertyParser,
            A.optionalWhitespace,
            comparisonOperators,
            A.optionalWhitespace,
            valueParser
        ])
        .map(([objectProperty, ws1, operator, ws2, value]) => ([objectProperty, operator, value]))
}

function createTailItemsParser(comparison) {
    return A.many1(
        A.sequenceOf([
            A.optionalWhitespace,
            binaryLogicalOperators,
            A.optionalWhitespace,
            comparison
        ])
        .map(([ws1, operator, ws2, comparison]) => ([operator, comparison]))
    )
}

function createReverseTailItemParser(comparison) {
    return A.many1(
        A.sequenceOf([
            comparison,
            A.optionalWhitespace,
            binaryLogicalOperators,
            A.optionalWhitespace,
        ])
        .map(([comparison, ws1, operator, ws2]) => ([comparison, operator]))
    )
}

function createConcatenationParser(comparison, tailItems) {
    return A.sequenceOf([
        comparison,
        tailItems
    ])
}

function createLeafParser(parameterNames) {
    const mapToComparisonObject = ([left, operator, right]) => createComparison(left, '=', right)

    const objectPropertyParser = createObjectPropertyParser(parameterNames).map(([object, property]) => ({ object, property }))
    const comparisonParser = createComparisonParser(objectPropertyParser, createValueParser(aString.map(x => x.slice(1, x.length-1)), aNumber))
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
    const objectProperty = createObjectPropertyParser(parameterNames).map(joinWithDot)
    const comparison = createComparisonParser(objectProperty, createValueParser()).map(x => x).map(joinWithWhitespace)
    const tailItems = createTailItemsParser(comparison).map(items => items.reduce((acc, item) => acc.concat(item)), [])
    const reverseTailItems = createReverseTailItemParser(comparison).map(items => items.reduce((acc, item) => acc.concat(item)), [])

    const parser = A.choice([
        // ) && (
        A.sequenceOf([closingParenthesis, A.optionalWhitespace, binaryLogicalOperators, A.optionalWhitespace, openingParenthesis])
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

export function parsePredicate<T>(f: (table: T) => boolean): PredicateExpression {
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

    const parameterNames = getParameterNames(f)

    // Split up strings that contain binary operators
    const splitBinaryLogicalOperators = createBinaryLogicalOperatorSplitter(parameterNames)

    const preprocessedSegments = splitBinaryLogicalOperators(unescapedSegments)

    const parseSegment = createSegmentParser(parameterNames)

    const result = parseSegment(preprocessedSegments)

    return result
}