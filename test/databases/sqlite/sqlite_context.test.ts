import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../../lib/databases/sqlite/sqlite_client'
import {createSqliteContext} from '../../../lib'
import {setUpSqliteTestData} from './sqlite_setup'
import {createDatabaseContextTestSuite} from '../database_context_test_suite'
import {employees} from '../../test_tables'

describe('SQLite context', () => {

    const sqliteClient = createSqliteInMemoryClient()
    const ctx = createSqliteContext(sqliteClient)
    const suite = createDatabaseContextTestSuite(ctx, employees)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await setUpSqliteTestData(sqliteClient)
    })

    it('can get a scalar', () => suite.testScalarQuery())

    describe('can get a single row', () => {
        it(
            'without a parameter',
            () =>  suite.testSingleRowQuery())

        it(
            'with a number parameter',
            () => suite.testSingleRowQueryWithNumberParameter())

        it(
            'with an object parameter',
            () => suite.testSingleRowQueryWithObjectParameter())
    })

    describe('can get multiple rows', () => {
        it(
            'without limit',
            () => suite.testRowQuery())

        it(
            'with a limit',
            () => suite.testLimitedQuery())

        it(
            'with a limited offset',
            () => suite.testLimitedOffsetQuery())
    })

    it(
        'can run queries in parallel',
        () => suite.testParallelQueries())
})