import {DatabaseClient} from '../database_client'
import {StringValueRecord} from '../../record'
import {BigQuery, Dataset} from '@google-cloud/bigquery'
import {Value} from '../../value'

export class BigQueryClient implements DatabaseClient {
    private dataset: Dataset

    constructor(private bigQuery: BigQuery, datasetId: string) {
        this.dataset = this.bigQuery.dataset(datasetId)
    }

    getScalar<T extends Value>(sql: string, parameters: StringValueRecord = {}): Promise<T> {
        return this.getSingleRow<StringValueRecord>(sql, parameters)
            .then(row => Object.values(row)[0] as T)
    }

    getVector<T extends Value>(sql: string, parameters: StringValueRecord = {}): Promise<T[]> {
        return this.getRows<StringValueRecord>(sql, parameters)
            .then(rows => rows.map(row => Object.values(row)[0] as T))
    }

    getSingleRow<T extends StringValueRecord>(sql: string, parameters: StringValueRecord = {}): Promise<T> {
        return this.getRows<T>(sql, parameters)
            .then(rows => rows[0])
    }

    getRows<T extends StringValueRecord>(sql: string, parameters: StringValueRecord = {}): Promise<T[]> {
        return this.dataset
            .query({
                query: sql,
                params: parameters
            })
            .then(([rows]) => rows)
    }

}

export function createBigQueryClient(bigQuery: BigQuery, datasetId: string): BigQueryClient {
    return new BigQueryClient(bigQuery, datasetId)
}