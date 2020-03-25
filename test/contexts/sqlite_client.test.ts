import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/contexts/sqlite_client'
import {employeeRows} from '../test_tables'
import {sqliteSetup} from './db_test_setup'

describe('SqliteClient', () => {
    const dbClient = createSqliteInMemoryClient()

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await dbClient.run(sqliteSetup.createEmployeesTable)

        await dbClient.runBatch(sqliteSetup.insertIntoEmployees, employeeRows)
    })

    it('can get a scalar', () => {
        return dbClient.getScalar('SELECT COUNT(*) FROM employees').should.eventually.equal(2)
    })

    it('can get a single row', () => {
        return dbClient.getSingleRow('SELECT first_name AS firstName, last_name AS lastName FROM employees WHERE id = 1')
            .should.eventually.eql({ firstName: 'John', lastName: 'Doe'})
    })

    it('can get multiple rows', () => {
        return dbClient.getRows('SELECT first_name AS firstName, last_name AS lastName FROM employees')
            .should.eventually.eql([
                { firstName: 'John', lastName: 'Doe'},
                { firstName: 'Richard', lastName: 'Roe'}
            ])
    })
})