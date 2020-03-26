import {DatabaseClient} from './database_client'
import {StringValueRecord} from '../record'
import {BigQuery} from '@google-cloud/bigquery'

export class BigQueryClient implements DatabaseClient {
    constructor(private client: BigQuery) {}

    getRows<T>(sql: string, parameters: StringValueRecord): Promise<T[]> {
        return new Promise<T[]>((res, rej) => {
            this.client
                .createQueryJob(sql)
                .then(([job]) => {

                    job.getQueryResults()
                        .then(([rows]) => res(rows))
                        .catch(err => rej(err))

                })
                .catch(err => rej(err))
        })
    }

    getSingleRow<T>(sql: string, parameters: StringValueRecord): Promise<T> {
        return this.getRows<T>(sql, parameters).then(rows => rows[0])
    }

    getScalar<T>(sql: string, parameters: StringValueRecord): Promise<T> {
        return this.getSingleRow<T>(sql, parameters).then(row => Object.values(row)[0])
    }

}