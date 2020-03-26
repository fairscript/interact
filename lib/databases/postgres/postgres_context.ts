import {DatabaseContext} from '../database_context'
import {PostgresClient} from './postgres_client'
import {postgresDialect} from './postgres_dialect'

export function createPostgresContext(client: PostgresClient) : DatabaseContext{
    return new DatabaseContext(client, postgresDialect)
}