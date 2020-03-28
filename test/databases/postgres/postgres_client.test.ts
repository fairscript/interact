require('dotenv').config()
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createPgTestClient, setUpPostgresTestData} from './postgres_setup'
import {createPostgresClient} from '../../../lib/databases/postgres/postgres_client'
import {createDatabaseClientTestSuite} from '../database_client_test_suite'

describe('PostgresClient', () => {

    const pg = createPgTestClient()
    const client = createPostgresClient(pg)

    const suite = createDatabaseClientTestSuite(
        client,
        'SELECT COUNT(*) FROM employees',
        'SELECT first_name AS "firstName", last_name AS "lastName" FROM employees WHERE id = 1',
        'SELECT title FROM employees',
        'SELECT first_name AS "firstName", last_name AS "lastName" FROM employees')

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await pg.connect()

        await setUpPostgresTestData(client)
    })

    it('can get a scalar', () => suite.testScalar())

    it('can get a single row', () => suite.testSingleRow())

    it('can get a vector', () => suite.testVector())

    it('can get multiple rows', () => suite.testRows())

    after(async() => {
        await pg.end()
    })

})