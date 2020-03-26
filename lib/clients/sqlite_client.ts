import { Database } from 'sqlite3'
import {DatabaseClient} from './database_client'
import {StringValueRecord} from '../record'

export class SqliteClient implements DatabaseClient {

    constructor (private db: Database) {}

    run(sql: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, err => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve()
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

    getScalar<T>(sql: string, parameters: StringValueRecord = {}): Promise<T> {
        return this.getSingleRow(sql, parameters)
            .then(row => Object.values(row)[0])
    }

    getSingleRow<T>(sql: string, parameters: StringValueRecord = {}): Promise<T> {
        return new Promise(
            (resolve, reject) => {
            this.db.get(
                sql,
                parameters,
                (err, row) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(row)
                    }
                })
            }
        )
    }

    getRows<T>(sql: string, parameters: StringValueRecord = {}): Promise<T[]> {
        return new Promise(
            (resolve, reject) => {
                this.db.all(
                    sql,
                    parameters,
                    (err, rows) => {
                        if (err) {
                            reject(err)
                        }
                        else {
                            resolve(rows)
                        }
                    }
                )
            }
        )
    }
}

export function createSqliteInMemoryClient(): SqliteClient {
    return new SqliteClient(new Database(':memory:'))
}

export function createSqliteInFileClient(filename: string): SqliteClient {
    return new SqliteClient(new Database(filename))
}

export function createSqliteClient(db: Database): SqliteClient {
    return new SqliteClient(db)
}