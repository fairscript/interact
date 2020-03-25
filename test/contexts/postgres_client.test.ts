require('dotenv').config()
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {Client} from 'pg'
import {createPostgresClient} from '../../lib/contexts/postgres_client'
import {employeeRows} from '../test_tables'
import {postgresSetup} from './db_test_setup'

describe('PostgresClient', () => {

    const pg = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })

    const client = createPostgresClient(pg)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await client.connect()

        await client.run(postgresSetup.truncateEmployeesTable)

        await client.runBatch(
            postgresSetup.insertTwoEmployees,
            employeeRows)

        createPostgresClient(pg)
    })

    it('can get a scalar', async() => {
        return client.getScalar<number>('SELECT COUNT(*) FROM employees', {})
            .should.eventually.equal(2)
    })

    it('can get a single row', () => {
        return client.getSingleRow('SELECT first_name AS "firstName", last_name AS "lastName" FROM employees WHERE id = 1')
            .should.eventually.eql({ firstName: 'John', lastName: 'Doe'})
    })

    it('can get multiple rows', () => {
        return client.getRows('SELECT first_name AS "firstName", last_name AS "lastName" FROM employees')
            .should.eventually.eql([
                { firstName: 'John', lastName: 'Doe'},
                { firstName: 'Richard', lastName: 'Roe'}
            ])
    })

    after(async() => {
        await client.end()
    })

})