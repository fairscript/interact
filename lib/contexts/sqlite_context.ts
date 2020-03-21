import * as sqlite3 from 'sqlite3'

export class SqliteContext{
    constructor (private db: sqlite3.Database) {}

    run(sql: string) {
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

    runBatch(sql: string, batch: any[][]) {
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

    getRows(sql: string) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, row) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(row)
                }
            })
        })
    }

    getSingleRow(sql: string) {
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

    getScalar(sql: string) {
        return this.getSingleRow(sql).then(row => Object.values(row)[0])
    }
}