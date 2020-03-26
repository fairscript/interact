import {createSqliteInFileClient, createSqliteInMemoryClient, SqliteClient} from './sqlite_client'
import {DatabaseContext} from '../database_context'
import {sqliteDialect} from './sqlite_dialect'

export function createSqliteContext(client: SqliteClient): DatabaseContext {
    return new DatabaseContext(client, sqliteDialect)
}

export function createSqliteInFileContext(filename: string) : DatabaseContext{
    return createSqliteContext(createSqliteInFileClient(filename))
}

export function createSqliteInMemoryContext() : DatabaseContext{
    return createSqliteContext(createSqliteInMemoryClient())
}