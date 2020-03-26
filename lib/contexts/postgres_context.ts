import {DatabaseContext} from './database_context'
import {PostgresClient} from '../clients/postgres_client'

export function createPostgresContext(client: PostgresClient) : DatabaseContext{
    return new DatabaseContext(client)
}