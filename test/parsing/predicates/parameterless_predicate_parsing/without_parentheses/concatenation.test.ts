import {createAnd, createConcatenation, createOr} from '../../../../../lib/parsing/predicates/concatenation'
import {createInsideParentheses} from '../../../../../lib/parsing/predicates/inside_parentheses'
import {createEqual} from '../../../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createParameterlessParser} from '../../../../../lib/parsing/predicates/predicate_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createLiteral} from '../../../../../lib/parsing/values/literal'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse', () => {

    const firstNameEqualsJohn = createEqual(createGetColumn('e', 'firstName'), createLiteral('John'))
    const firstNameEqualsRichard = createEqual(createGetColumn('e', 'firstName'), createLiteral('Richard'))
    const lastNameEqualsRoe = createEqual(createGetColumn('e', 'lastName'), createLiteral('Roe'))
    const lastNameEqualsDoe = createEqual(createGetColumn('e', 'lastName'), createLiteral('Doe'))
    const titleEqualsCeo = createEqual(createGetColumn('e', 'title'), createLiteral('CEO'))

    describe('a conjunction of', () => {
        it('two items', () => {
            assertMatches(
                e => e.firstName === 'John' && e.lastName === 'Doe',
                createConcatenation(
                    firstNameEqualsJohn,
                    [
                        createAnd(lastNameEqualsDoe)
                    ]
                ))
        })

        it('three items', () => {
            assertMatches(
                e => e.title === 'CEO' && e.firstName === 'John' && e.lastName === 'Doe',
                createConcatenation(
                    titleEqualsCeo,
                    [
                        createAnd(firstNameEqualsJohn),
                        createAnd(lastNameEqualsDoe)
                    ]
                ))
        })

        it('two disjunctions', () => {
            assertMatches(
                e => (e.firstName === 'John' || e.firstName === 'Richard') && (e.lastName === 'Doe' || e.lastName === 'Roe'),
                createConcatenation(
                    createInsideParentheses(
                        createConcatenation(
                            firstNameEqualsJohn,
                            [
                                createOr(firstNameEqualsRichard)
                            ],
                        )
                    ),
                    [
                        createAnd(
                            createInsideParentheses(
                                createConcatenation(
                                    lastNameEqualsDoe,
                                    [
                                        createOr(lastNameEqualsRoe)
                                    ]
                                )
                            )
                        )
                    ]
                )
            )
        })
    })

    describe('a disjunction of', () => {

        it('two items', () => {
            assertMatches(
                e => e.firstName === 'Jim' || e.firstName === 'James',
                createConcatenation(
                    createEqual(createGetColumn('e', 'firstName'), createLiteral('Jim')),
                    [
                        createOr(
                            createEqual(createGetColumn('e', 'firstName'), createLiteral('James'))
                        )
                    ]
                )
            )
        })

        it('three items', () => {
            assertMatches(
                e => e.firstName === 'Jim' || e.firstName === 'James' || e.firstName === 'Jimmy',
                createConcatenation(
                    createEqual(createGetColumn('e', 'firstName'), createLiteral('Jim')),
                    [
                        createOr(
                            createEqual(createGetColumn('e', 'firstName'), createLiteral('James'))
                        ),
                        createOr(
                            createEqual(createGetColumn('e', 'firstName'), createLiteral('Jimmy'))
                        )
                    ]
                )
            )
        })

        it('two conjunctions', () => {
            assertMatches(
                e => e.firstName === 'John' && e.lastName === 'Doe' || e.firstName === 'Richard' && e.lastName === 'Roe',
                createConcatenation(
                    firstNameEqualsJohn,
                    [
                        createAnd(lastNameEqualsDoe),
                        createOr(firstNameEqualsRichard),
                        createAnd(lastNameEqualsRoe)
                    ]
                )
            )
        })
    })

})
