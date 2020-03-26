import {DatabaseContext} from './database_context'
import {createBigQueryClient} from '../clients/bigquery_client'
import {BigQuery} from '@google-cloud/bigquery'
import {bigQueryDialect} from '../dialects/dialects'

export function createBigQueryContext(bigQuery: BigQuery, dataset: string): DatabaseContext{
    const client = createBigQueryClient(bigQuery, dataset)

    return new DatabaseContext(client, bigQueryDialect)
}