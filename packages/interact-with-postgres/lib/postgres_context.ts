import {PostgresClient} from './postgres_client'
import {postgresDialect} from './postgres_dialect'
import {DatabaseContext} from '@fairscript/interact'

export function createPostgresContext(client: PostgresClient): DatabaseContext{
    return new DatabaseContext(client, postgresDialect)
}