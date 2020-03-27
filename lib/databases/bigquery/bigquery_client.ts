import {DatabaseClient} from '../database_client'
import {StringValueRecord} from '../../record'
import {BigQuery, Dataset, Query} from '@google-cloud/bigquery'

export class BigQueryClient implements DatabaseClient {
    private dataset: Dataset

    constructor(private bigQuery: BigQuery, datasetId: string) {
        this.dataset = this.bigQuery.dataset(datasetId)
    }

    getRows<T>(sql: string, parameters: StringValueRecord): Promise<T[]> {
        return this.dataset
            .query({
                query: sql,
                params: parameters
            })
            .then(([rows]) => rows)
    }

    getSingleRow<T>(sql: string, parameters: StringValueRecord): Promise<T> {
        return this.getRows<T>(sql, parameters).then(rows => rows[0])
    }

    getScalar<T>(sql: string, parameters: StringValueRecord): Promise<T> {
        return this.getSingleRow<T>(sql, parameters).then(row => Object.values(row)[0])
    }

}

export function createBigQueryClient(bigQuery: BigQuery, datasetId: string): BigQueryClient {
    return new BigQueryClient(bigQuery, datasetId)
}