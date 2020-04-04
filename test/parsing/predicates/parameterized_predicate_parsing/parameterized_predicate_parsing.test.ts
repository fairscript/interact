import * as assert from 'assert'
import {createGetProvided} from '../../../../lib/parsing/valuexpressions/get_provided_parsing'
import {createConcatenation, createTailItem} from '../../../../lib/parsing/booleanexpressions/concatenation'
import {createComparison, createEqual} from '../../../../lib/parsing/booleanexpressions/comparisons'
import {createGetColumn} from '../../../../lib/parsing/valuexpressions/get_column_parsing'
import {parseParameterizedPredicate, BooleanExpression} from '../../../../lib/parsing/booleanexpressions/boolean_expression_parsing'
import {extractLambdaParametersAndExpression} from '../../../../lib/parsing/javascript/lambda_parsing'
import {createNegation} from '../../../../lib/parsing/booleanexpressions/negation_parsing'

describe('parseParameterizedPredicate can parse', () => {

    function test(f: Function, expected: BooleanExpression) {
        const { parameters, expression } = extractLambdaParametersAndExpression(f)

        const actual = parseParameterizedPredicate('f1', parameters[0], parameters.slice(1), expression)

        assert.deepEqual(actual, expected)
    }


    it('a boolean value evaluation', () => {
        test(
            fulltime => fulltime,
            createGetProvided('f1', 'fulltime', [])
        )
    })

    it('a negated boolean value evaluation', () => {
        it('negatively', () => {
            test(
                fulltime => !fulltime,
                createNegation(createGetProvided('f1', 'fulltime', []))
            )
        })
    })

    describe('comparisons', () => {
        it('with a number parameter', () => {
            test(
                (id, e) => e.id === id,
                createEqual(createGetColumn('e', 'id'), createGetProvided('f1', 'id', []))
            )
        })

        it('with an object parameter', () => {
            test(
                (name, e) => e.firstName === name.firstName && e.lastName === name.lastName,
                createConcatenation(
                    createEqual(createGetColumn('e', 'firstName'), createGetProvided('f1', 'name', ['firstName'])),
                    [
                        createTailItem('&&', createComparison(createGetColumn('e', 'lastName'), '===', createGetProvided('f1', 'name', ['lastName'])))
                    ]
                )
            )
        })

        it('with a nested object parameter', () => {
            test(
                (search, e) => e.firstName === search.name.firstName && e.lastName === search.name.lastName,
                createConcatenation(
                    createEqual(createGetColumn('e', 'firstName'), createGetProvided('f1', 'search', ['name', 'firstName'])),
                    [
                        createTailItem('&&', createComparison(createGetColumn('e', 'lastName'), '===', createGetProvided('f1', 'search', ['name', 'lastName'])))
                    ]
                )
            )
        })
    })
})