import {createSqliteInFileClient, createSqliteInMemoryClient, SqliteClient} from '../clients/sqlite_client'
import {DatabaseContext} from './database_context'
import {sqliteDialect} from '../dialects/dialects'

export function createSqliteContext(client: SqliteClient): DatabaseContext {
    return new DatabaseContext(client, sqliteDialect)
}

export function createSqliteInFileContext(filename: string) : DatabaseContext{
    return createSqliteContext(createSqliteInFileClient(filename))
}

export function createSqliteInMemoryContext() : DatabaseContext{
    return createSqliteContext(createSqliteInMemoryClient())
}