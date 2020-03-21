import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {SqliteContext} from '../../lib/contexts/sqlite_context'
import {createEmployeesTableSql, insertEmployeeSql} from '../test_tables'

const dbContext = new SqliteContext(new sqlite3.Database(':memory:'))

describe('SqliteContext', () => {

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await dbContext.run(createEmployeesTableSql)

        await dbContext.runBatch(
            insertEmployeeSql,
            [
                ['John', 'Doe', 'CEO', 10_000, 1],
                ['Richard', 'Roe', 'CFO', 8_000, 1]
            ])
    })

    it('can get a scalar', () => {
        return dbContext.getScalar('SELECT COUNT(*) FROM employees').should.eventually.equal(2)
    })

    it('can get a single row', () => {
        return dbContext.getSingleRow('SELECT first_name AS firstName, last_name AS lastName FROM employees WHERE id = 1')
            .should.eventually.eql({ firstName: 'John', lastName: 'Doe'})
    })

    it('can get multiple rows', () => {
        return dbContext.getRows('SELECT first_name AS firstName, last_name AS lastName FROM employees')
            .should.eventually.eql([
                { firstName: 'John', lastName: 'Doe'},
                { firstName: 'Richard', lastName: 'Roe'}
            ])
    })
})