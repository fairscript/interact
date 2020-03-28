import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../../lib/databases/sqlite/sqlite_client'
import {setUpSqliteTestData} from './sqlite_setup'
import {createDatabaseClientTestSuite} from '../database_client_test_suite'

describe('SqliteClient', () => {
    const client = createSqliteInMemoryClient()

    const suite = createDatabaseClientTestSuite(
        client,
        'SELECT COUNT(*) FROM employees',
        'SELECT first_name AS firstName, last_name AS lastName FROM employees WHERE id = 1',
        'SELECT title FROM employees',
        'SELECT first_name AS firstName, last_name AS lastName FROM employees')

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await setUpSqliteTestData(client)
    })

    it('can get a scalar', () => suite.testScalar())

    it('can get a single row', () => suite.testSingleRow())

    it('can get a vector', () => suite.testVector())

    it('can get multiple rows', () => suite.testRows())
})