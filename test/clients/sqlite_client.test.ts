import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/clients/sqlite_client'
import {setUpSqliteTestData} from '../setup/sqlite_setup'

describe('SqliteClient', () => {
    const sqliteClient = createSqliteInMemoryClient()

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await setUpSqliteTestData(sqliteClient)
    })

    it('can get a scalar', () => {
        return sqliteClient.getScalar('SELECT COUNT(*) FROM employees').should.eventually.equal(2)
    })

    it('can get a single row', () => {
        return sqliteClient.getSingleRow('SELECT first_name AS firstName, last_name AS lastName FROM employees WHERE id = 1')
            .should.eventually.eql({ firstName: 'John', lastName: 'Doe'})
    })

    it('can get multiple rows', () => {
        return sqliteClient.getRows('SELECT first_name AS firstName, last_name AS lastName FROM employees')
            .should.eventually.eql([
                { firstName: 'John', lastName: 'Doe'},
                { firstName: 'Richard', lastName: 'Roe'}
            ])
    })
})