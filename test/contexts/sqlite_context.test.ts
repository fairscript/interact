import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/clients/sqlite_client'
import {createSqliteContext} from '../../lib'
import {setupSqliteTestData} from '../clients/db_test_setup'
import {
    testParallelQueries,
    testRowQuery,
    testScalarQuery,
    testSingleRowQuery,
    testSingleRowQueryWithNumberParameter,
    testSingleRowQueryWithObjectParameter
} from './database_context_tests'

describe('Sqlite context', () => {

    const sqliteClient = createSqliteInMemoryClient()
    const ctx = createSqliteContext(sqliteClient)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await setupSqliteTestData(sqliteClient)
    })

    it('can get a scalar', () => testScalarQuery(ctx))

    describe('can get a single row', () => {

        it(
            'without a parameter',
            () =>  testSingleRowQuery(ctx))

        it(
            'with a number parameter',
            () => testSingleRowQueryWithNumberParameter(ctx))

        it(
            'with an object parameter',
            () => testSingleRowQueryWithObjectParameter(ctx))
    })

    it(
        'can get multiple rows',
        () => testRowQuery(ctx))

    it(
        'can run queries in parallel',
        () => testParallelQueries(ctx))
})