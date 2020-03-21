import {createSqliteClient, createSqliteInMemoryClient, SqliteClient} from './sqlite_client'
import {
    RowSelectGenerator,
    ScalarSelectGenerator,
    SingleRowSelectGenerator
} from '../queries/select_generators'

export class SqliteContext {
    constructor(private client: SqliteClient) {}

    get<T>(generator: ScalarSelectGenerator<T>): Promise<T>
    get<T>(generator: SingleRowSelectGenerator<T>): Promise<T>
    get<T>(generator: RowSelectGenerator<T>): Promise<T[]>
    get<T>(generator: ScalarSelectGenerator<T>|SingleRowSelectGenerator<T>|RowSelectGenerator<T>): Promise<T>|Promise<T[]> {
        const sql = generator.toSql()

        switch (generator.kind) {
            case 'row-select-generator':
                return this.client.getRows<T>(sql)
            case 'scalar-select-generator':
                return this.client.getScalar<T>(sql)
            case 'single-row-select-generator':
                return this.client.getSingleRow<T>(sql)
        }
    }
}

export function createSqliteContext(client: SqliteClient): SqliteContext
export function createSqliteContext(filename: string): SqliteContext
export function createSqliteContext(clientOrFilename: SqliteClient|string): SqliteContext {
    const client = typeof clientOrFilename === 'string' ? createSqliteClient(clientOrFilename) : clientOrFilename

    return new SqliteContext(client)
}

export function createSqliteInMemoryContext() : SqliteContext{
    return new SqliteContext(createSqliteInMemoryClient())
}