import {postgresDialect} from './postgres_dialect'
import {DatabaseContext} from '@fairscript/interact/lib/databases/database_context'
import {Client} from 'pg'
import {createPostgresClient} from './postgres_client'

export function createPostgresContext(pg: Client): DatabaseContext{
    return new DatabaseContext(createPostgresClient(pg), postgresDialect)
}