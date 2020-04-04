import {createEqual} from '../../../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createConstant, nullSingleton} from '../../../../../lib/parsing/predicates/side_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createParameterlessParser} from '../../../../../lib/parsing/predicates/predicate_parsing'

const parserForOneTable = createParameterlessParser(['e'])
const assertMatchesUsingOneTable = createAssertParameterlessPredicateParserMatches(parserForOneTable)

const parserForTwoTables = createParameterlessParser(['e', 'd'])
const assertMatchesUsingTwoTables = createAssertParameterlessPredicateParserMatches(parserForTwoTables)

describe('parseParameterlessPredicate can parse', () => {

    const getIdColumn = createGetColumn('e', 'id')
    const constantOne = createConstant(1)

    const idEqualsOne = createEqual(getIdColumn, constantOne)
    const oneEqualsId = createEqual(constantOne, getIdColumn)
    const oneEqualsOne = createEqual(constantOne, constantOne)
    const idEqualsId = createEqual(getIdColumn, getIdColumn)

    const getTitleColumn = createGetColumn('e', 'title')
    const constantCeo = createConstant('CEO')

    const titleEqualsCeo = createEqual(getTitleColumn, constantCeo)
    const ceoEqualsTitle = createEqual(constantCeo, getTitleColumn)
    const ceoEqualsCeo = createEqual(constantCeo, constantCeo)
    const titleEqualsTitle = createEqual(getTitleColumn, getTitleColumn)

    const getFullTimeColumn = createGetColumn('e', 'fulltime')
    const constantTrue = createConstant(true)

    const fulltimeEqualsTrue = createEqual(getFullTimeColumn, constantTrue)
    const trueEqualsFulltime = createEqual(constantTrue, getFullTimeColumn)
    const trueEqualsTrue = createEqual(constantTrue, constantTrue)
    const fulltimeEqualsFulltime = createEqual(getFullTimeColumn, getFullTimeColumn)

    describe('equalities with', () => {
        describe('an integer', () => {
            describe('using no table', () => {
                it('with constants on both sides', () => {
                    assertMatchesUsingOneTable(
                        () => 1 == 1,
                        oneEqualsOne)
                })
            })

            describe('using one table', () => {
                it('with a column on the left and a constant on the right', () => {
                    assertMatchesUsingOneTable(
                        e => e.id == 1,
                        idEqualsOne)
                })

                it('with a constant on the left and a column on the rights', () => {
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
                        createEqual(createGetColumn('e', 'id'), constantOne)
                    )
                })

                it('with a reference only to the second table', () => {
                    assertMatchesUsingTwoTables(
                        (e, d) => d.id === 1,
                        createEqual(createGetColumn('d', 'id'), constantOne)
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
            it('column on the left and constant on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.title == 'CEO',
                    titleEqualsCeo)
            })

            it('constant on the left and column on the right', () => {
                assertMatchesUsingOneTable(
                    e => 'CEO' == e.title,
                    ceoEqualsTitle)
            })

            it('constant on both sides', () => {
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
            it('column on the left and constant on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.fulltime == true,
                    fulltimeEqualsTrue)
            })

            it('constant on the left and column on the right', () => {
                assertMatchesUsingOneTable(
                    e => true == e.fulltime,
                    trueEqualsFulltime)
            })

            it('constant on both sides', () => {
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
            it('column on the left and constant on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.id === 1,
                    idEqualsOne)
            })

            it('constant on the left and column on the rights', () => {
                assertMatchesUsingOneTable(
                    e => 1 === e.id,
                    oneEqualsId)
            })

            it('constant on both sides', () => {
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
            it('column on the left and constant on the right', () => {
                assertMatchesUsingOneTable(
                    e => e.fulltime === true,
                    fulltimeEqualsTrue)
            })

            it('constant on the left and column on the right', () => {
                assertMatchesUsingOneTable(
                    e => true === e.fulltime,
                    trueEqualsFulltime)
            })

            it('constant on both sides', () => {
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