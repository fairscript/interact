import {createPgTestClient, setUpPostgresTestData} from '../setup/postgres_setup'

require('dotenv').config()
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createPostgresClient} from '../../lib/clients/postgres_client'

describe('PostgresClient', () => {

    const pg = createPgTestClient()
    const client = createPostgresClient(pg)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await pg.connect()

        await setUpPostgresTestData(client)
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
        await pg.end()
    })

})