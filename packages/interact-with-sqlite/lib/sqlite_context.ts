import {createSqliteInFileClient, createSqliteInMemoryClient, SqliteClient} from './sqlite_client'
import {sqliteDialect} from './sqlite_dialect'
import {DatabaseContext} from '@fairscript/interact/lib/databases/database_context'

export function createSqliteContext(client: SqliteClient): DatabaseContext {
    return new DatabaseContext(client, sqliteDialect)
}

export function createSqliteOnDiskContext(filename: string) : DatabaseContext {
    return createSqliteContext(createSqliteInFileClient(filename))
}

export function createSqliteInMemoryContext() : DatabaseContext {
    return createSqliteContext(createSqliteInMemoryClient())
}