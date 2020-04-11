import {BigQuery, Dataset} from '@google-cloud/bigquery'
import {DatabaseClient, Value, ValueRecord} from '@fairscript/interact'

export class BigQueryClient implements DatabaseClient {
    private dataset: Dataset

    constructor(private bigQuery: BigQuery, datasetId: string) {
        this.dataset = this.bigQuery.dataset(datasetId)
    }

    getScalar<T extends Value>(sql: string, parameters: ValueRecord = {}): Promise<T> {
        return this.getSingleRow<ValueRecord>(sql, parameters)
            .then(row => Object.values(row)[0] as T)
    }

    getVector<T extends Value>(sql: string, parameters: ValueRecord = {}): Promise<T[]> {
        return this.getRows<ValueRecord>(sql, parameters)
            .then(rows => rows.map(row => Object.values(row)[0] as T))
    }

    getSingleRow<T extends ValueRecord>(sql: string, parameters: ValueRecord = {}): Promise<T> {
        return this.getRows<T>(sql, parameters)
            .then(rows => rows[0])
    }

    getRows<T extends ValueRecord>(sql: string, parameters: ValueRecord = {}): Promise<T[]> {
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