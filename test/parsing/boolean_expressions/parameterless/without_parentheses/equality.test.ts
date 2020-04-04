import {createEqual} from '../../../../../lib/parsing/boolean_expressions/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/value_expressions/get_column_parsing'
import {createAssertParameterlessBooleanExpressionParserMatches} from '../../boolean_expression_assertion'
import {createParameterlessBooleanExpressionParser} from '../../../../../lib/parsing/boolean_expressions/boolean_expression_parsing'
import {createLiteral} from '../../../../../lib/parsing/values/literal'
import {nullSingleton} from '../../../../../lib/parsing/values/null'

const parserForOneTable = createParameterlessBooleanExpressionParser(['e'])
const assertMatchesUsingOneTable = createAssertParameterlessBooleanExpressionParserMatches(parserForOneTable)

const parserForTwoTables = createParameterlessBooleanExpressionParser(['e', 'd'])
const assertMatchesUsingTwoTables = createAssertParameterlessBooleanExpressionParserMatches(parserForTwoTables)

describe('parseParameterlessPredicate can parse', () => {

    const getIdColumn = createGetColumn('e', 'id')
    const literalOne = createLiteral(1)

    const idEqualsOne = createEqual(getIdColumn, literalOne)
    const oneEqualsId = createEqual(literalOne, getIdColumn)
    const oneEqualsOne = createEqual(literalOne, literalOne)
    const idEqualsId = createEqual(getIdColumn, getIdColumn)

    const getTitleColumn = createGetColumn('e', 'title')
    const literalCeo = createLiteral('CEO')

    const titleEqualsCeo = createEqual(getTitleColumn, literalCeo)
    const ceoEqualsTitle = createEqual(literalCeo, getTitleColumn)
    const ceoEqualsCeo = createEqual(literalCeo, literalCeo)
    const titleEqualsTitle = createEqual(getTitleColumn, getTitleColumn)

    const getFullTimeColumn = createGetColumn('e', 'fulltime')
    const literalTrue = createLiteral(true)

    const fulltimeEqualsTrue = createEqual(getFullTimeColumn, literalTrue)
    const trueEqualsFulltime = createEqual(literalTrue, getFullTimeColumn)
    const trueEqualsTrue = createEqual(literalTrue, literalTrue)
    const fulltimeEqualsFulltime = createEqual(getFullTimeColumn, getFullTimeColumn)

    describe('equalities with', () => {
        describe('an integer', () => {
            describe('using no table', () => {
                it('with literals on both sides', () => {
                    assertMatchesUsingOneTable(
                        () => 1 == 1,
                        oneEqualsOne)
                })
            })

            describe('using one table', () => {
                it('with a column on the left and a literal on the right', () => {
                    assertMatchesUsingOneTable(
                        e => e.id == 1,
                        idEqualsOne)
                })

                it('with a literal on the left and a column on the rights', () => {
                    assertMatchesUsingOneTable(
                        e => 1 == e.id,
                        oneEqualsId)
                })

                it('with columns on both sides', () => {
                    assertMatchesUsingOneTable(
                        e => e.id == e.id,
                        idEqualsId)
                })
            })

            describe('using a join of two tables', () => {
                it('with a reference only to the first table', () => {
                    assertMatchesUsingTwoTables(
                        (e, d) => e.id === 1,
                        createEqual(createGetColumn('e', 'id'), literalOne)
                    )
                })

                it('with a reference only to the second table', () => {
                    assertMatchesUsingTwoTables(
                        (e, d) => d.id === 1,
                        createEqual(createGetColumn('d', 'id'), literalOne)
                    )
                })

                it('with references to both tables', () => {
                    assertMatchesUsingTwoTables(
                        (e, d) => e.id === d.id,
                        createEqual(createGetColumn('e', 'id'), createGetColumn('d', 'id'))
                    )
                })

                it('with references to both tables in reverse order', () => {
                    assertMatchesUsingTwoTables(
                        (e, d) => d.id === e.id,
                        createEqual(createGetColumn('d', 'id'), createGetColumn('e', 'id'))
                    )
                })
            })
        })

        describe('a string', () => {
            it('column on the left and literal on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.title == 'CEO',
                    titleEqualsCeo)
            })

            it('literal on the left and column on the right', () => {
                assertMatchesUsingOneTable(
                    e => 'CEO' == e.title,
                    ceoEqualsTitle)
            })

            it('literal on both sides', () => {
                assertMatchesUsingOneTable(
                    () => 'CEO' == 'CEO',
                    ceoEqualsCeo)
            })

            it('column on both sides', () => {
                assertMatchesUsingOneTable(
                    e => e.title == e.title,
                    titleEqualsTitle)
            })

        })

        describe('a boolean', () => {
            it('column on the left and literal on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.fulltime == true,
                    fulltimeEqualsTrue)
            })

            it('literal on the left and column on the right', () => {
                assertMatchesUsingOneTable(
                    e => true == e.fulltime,
                    trueEqualsFulltime)
            })

            it('literal on both sides', () => {
                assertMatchesUsingOneTable(
                    () => true == true,
                    trueEqualsTrue)
            })

            it('column on both sides', () => {
                assertMatchesUsingOneTable(
                    e => e.fulltime == e.fulltime,
                    fulltimeEqualsFulltime)
            })
        })

        describe('null', () => {
            it('on the left side', () => {
                assertMatchesUsingOneTable(
                    e => null == e.salary,
                    createEqual(
                        nullSingleton, createGetColumn('e', 'salary')
                    ))
            })

            it('on the right side', () => {
                assertMatchesUsingOneTable(
                    e => e.salary == null,
                    createEqual(
                        createGetColumn('e', 'salary'), nullSingleton
                    ))
            })

            it('on both sides', () => {
                assertMatchesUsingOneTable(
                    () => null == null,
                    createEqual(
                        nullSingleton, nullSingleton
                    ))
            })
        })
    })

    describe('strict equalities with', () => {
        describe('an integer', () => {
            it('column on the left and literal on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.id === 1,
                    idEqualsOne)
            })

            it('literal on the left and column on the rights', () => {
                assertMatchesUsingOneTable(
                    e => 1 === e.id,
                    oneEqualsId)
            })

            it('literal on both sides', () => {
                assertMatchesUsingOneTable(
                    () => 1 === 1,
                    oneEqualsOne)
            })

            it('column on both sides', () => {
                assertMatchesUsingOneTable(
                    e => e.id === e.id,
                    idEqualsId)
            })
        })

        describe('a string', () => {
            describe('column on both sides', () => {
                assertMatchesUsingOneTable(
                    e => e.title === e.title,
                    titleEqualsTitle)
            })

            describe('using single quotes for literals', () => {
                it('with a column on the left and a literal on the right', () => {
                    assertMatchesUsingOneTable(
                        e => e.title === 'CEO',
                        titleEqualsCeo)
                })

                it('with a literal on the left and a column on the right', () => {
                    assertMatchesUsingOneTable(
                        e => 'CEO' === e.title,
                        ceoEqualsTitle)
                })

                it('with literals on both sides', () => {
                    assertMatchesUsingOneTable(
                        () => 'CEO' === 'CEO',
                        ceoEqualsCeo)
                })
            })

            describe('using double quotes for literals', () => {
                it('with a column on the left and a literal on the right', () => {
                    assertMatchesUsingOneTable(
                        e => e.title === "CEO",
                        titleEqualsCeo)
                })

                it('with a literal on the left and a column on the right', () => {
                    assertMatchesUsingOneTable(
                        e => "CEO" === e.title,
                        ceoEqualsTitle)
                })

                it('with literals on both sides', () => {
                    assertMatchesUsingOneTable(
                        () => "CEO" === "CEO",
                        ceoEqualsCeo)
                })
            })
        })

        describe('a boolean', () => {
            it('column on the left and literal on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.fulltime === true,
                    fulltimeEqualsTrue)
            })

            it('literal on the left and column on the right', () => {
                assertMatchesUsingOneTable(
                    e => true === e.fulltime,
                    trueEqualsFulltime)
            })

            it('literal on both sides', () => {
                assertMatchesUsingOneTable(
                    () => true === true,
                    trueEqualsTrue)
            })

            it('column on both sides', () => {
                assertMatchesUsingOneTable(
                    e => e.fulltime === e.fulltime,
                    fulltimeEqualsFulltime)
            })
        })

        describe('null', () => {
            it('on the left side', () => {
                assertMatchesUsingOneTable(
                    e => null === e.salary,
                    createEqual(
                        nullSingleton, createGetColumn('e', 'salary')
                    ))
            })

            it('on the right side', () => {
                assertMatchesUsingOneTable(
                    e => e.salary === null,
                    createEqual(
                        createGetColumn('e', 'salary'), nullSingleton
                    ))
            })

            it('on both sides', () => {
                assertMatchesUsingOneTable(
                    () => null === null,
                    createEqual(
                        nullSingleton, nullSingleton
                    ))
            })
        })
    })

})