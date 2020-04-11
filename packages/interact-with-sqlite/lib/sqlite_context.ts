import {DatabaseContext} from '@fairscript/interact'
import {createSqliteInFileClient, createSqliteInMemoryClient, SqliteClient} from './sqlite_client'
import {sqliteDialect} from './sqlite_dialect'

export function createSqliteContext(client: SqliteClient): DatabaseContext {
    return new DatabaseContext(client, sqliteDialect)
}

export function createSqliteInFileContext(filename: string) : DatabaseContext {
    return createSqliteContext(createSqliteInFileClient(filename))
}

export function createSqliteInMemoryContext() : DatabaseContext {
    return createSqliteContext(createSqliteInMemoryClient())
}