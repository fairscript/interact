import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/clients/sqlite_client'
import {createSqliteContext} from '../../lib'
import {setUpSqliteTestData} from '../setup/sqlite_setup'
import {createDatabaseContextTestSuite} from './database_context_tests'
import {employees} from '../test_tables'

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

    it(
        'can get multiple rows',
        () => suite.testRowQuery())

    it(
        'can run queries in parallel',
        () => suite.testParallelQueries())
})