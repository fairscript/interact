import * as sqlite3 from 'sqlite3'
import {DatabaseClient} from './database_client'

export class SqliteClient implements DatabaseClient {
    private db: sqlite3.Database
    constructor (filename: string) {
        this.db = new sqlite3.Database(filename)
    }

    run(sql: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, (err, row) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(row)
                }
            })
        })
    }

    runBatch(sql: string, batch: any[][]): Promise<void> {
        const statement = this.db.prepare(sql)

        batch.forEach(item => {
            statement.run(item)
        })

        return new Promise((resolve, reject) => {
            statement.finalize(err => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve()
                }
            })
        })
    }

    getRows<T>(sql: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(rows)
                }
            })
        })
    }

    getSingleRow<T>(sql: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, (err, row) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(row)
                }
            })
        })
    }

    getScalar<T>(sql: string): Promise<T> {
        return this.getSingleRow(sql).then(row => Object.values(row)[0])
    }
}

export function createSqliteInMemoryClient() {
    return new SqliteClient(':memory:')
}

export function createSqliteClient(filename: string) {
    return new SqliteClient(filename)
}