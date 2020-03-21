import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient, SqliteClient} from '../../lib/contexts/sqlite_client'
import {createEmployeesTableSql, employees, insertEmployeeSql} from '../test_tables'
import {createSqliteContext, createSqliteInMemoryContext} from '../../lib/contexts/sqlite_context'
import {SingleRowSelectGenerator} from '../../lib/queries/select_generators'

describe('SqliteContext', () => {

    const dbClient = createSqliteInMemoryClient()
    const dbContext = createSqliteContext(dbClient)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await dbClient.run(createEmployeesTableSql)

        await dbClient.runBatch(
            insertEmployeeSql,
            [
                ['John', 'Doe', 'CEO', 10_000, 1],
                ['Richard', 'Roe', 'CFO', 8_000, 1]
            ])
    })

    it('can get a scalar', () => {
        const promiseOfScalar: Promise<number> = dbContext
            .get(employees.count())

        return promiseOfScalar
            .should.eventually.equal(2)
    })

    it('can get a single row', () => {
        const query: SingleRowSelectGenerator<{ firstName: string; lastName: string }> =
            employees.filter(e => e.id === 1).map(e => ({firstName: e.firstName, lastName: e.lastName})).single()

        const promiseOfRow: Promise<{ firstName: string; lastName: string }> = dbContext
            .get(query)

        return promiseOfRow
            .should.eventually.eql({ firstName: 'John', lastName: 'Doe'})
    })

    it('can get multiple rows', () => {
        const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = dbContext
            .get(employees.map(e => ({firstName: e.firstName, lastName: e.lastName})))

        return promiseOfRows
            .should.eventually.eql([
                { firstName: 'John', lastName: 'Doe'},
                { firstName: 'Richard', lastName: 'Roe'}
            ])
    })
})