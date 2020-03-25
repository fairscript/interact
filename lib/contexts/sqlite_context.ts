import {createSqliteInFileClient, createSqliteInMemoryClient, SqliteClient} from './sqlite_client'
import {DatabaseContext} from './database_context'

export function createSqliteContext(client: SqliteClient): DatabaseContext {
    return new DatabaseContext(client)
}

export function createSqliteInFileContext(filename: string) : DatabaseContext{
    return new DatabaseContext(createSqliteInFileClient(filename))
}

export function createSqliteInMemoryContext() : DatabaseContext{
    return new DatabaseContext(createSqliteInMemoryClient())
}