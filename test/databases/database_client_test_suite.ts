import {DatabaseClient} from '../../lib/databases/database_client'
import {testEmployees} from '../test_tables'

export function createDatabaseClientTestSuite(
    client: DatabaseClient,
    scalar: string,
    singleRow: string,
    vector: string,
    rows: string) {

    return {
        testScalar: () => client.getScalar(scalar, {})
            .should.eventually.equal(testEmployees.length),

        testSingleRow: () => {
            const firstEmployee = testEmployees.find(e => e.id === 1)!
            client.getSingleRow(singleRow, {})
                .should.eventually.eql({ firstName: firstEmployee.firstName, lastName: firstEmployee.lastName })
        },

        testVector: () => client.getVector(vector, {})
            .should.eventually.eql(testEmployees.map(e => e.title)),

        testRows: () => client.getRows(rows, {})
            .should.eventually.eql(testEmployees.map(e =>({ firstName: e.firstName, lastName: e.lastName })))
    }
}