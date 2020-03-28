import {Client, QueryConfig, types} from 'pg'
import {DatabaseClient} from '../database_client'
import {StringValueRecord} from '../../record'
import {Value} from '../../value'
const named = require('yesql').pg

export class PostgresClient implements DatabaseClient {
    constructor(private pg: Client) {
        types.setTypeParser(20, value => parseInt(value))
    }

    getScalar<T extends Value>(sql: string, parameters: StringValueRecord = {}): Promise<T> {
        return this.getSingleRow<StringValueRecord>(sql, parameters)
            .then(row => Object.values(row)[0] as T)
    }

    getVector<T extends Value>(sql: string, parameters: StringValueRecord = {}): Promise<T[]> {
        return this.getRows<StringValueRecord>(sql, parameters)
            .then(rows => rows.map(row => Object.values(row)[0] as T))
    }

    getRows<T extends StringValueRecord>(sql: string, parameters: StringValueRecord = {}): Promise<T[]> {
        return this.pg.query(named(sql)(parameters))
            .then(res => res.rows)
    }

    getSingleRow<T extends StringValueRecord>(sql: string, parameters: StringValueRecord = {}): Promise<T> {
        return this.getRows<T>(sql, parameters)
            .then((rows: T[]) => rows[0])
    }

    run(sql: string): Promise<void> {
        return this.pg.query(sql)
            .then(() => {})
    }

    runBatch(sql: string, batch: any[][]): Promise<void> {
        return this.pg.query(sql, batch.reduce((acc, val) => acc.concat(val), []))
            .then(() => {})
    }
}

export function createPostgresClient(pg: Client): PostgresClient {
    return new PostgresClient(pg)
}