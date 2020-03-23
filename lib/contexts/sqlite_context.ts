import {createSqliteClient, createSqliteInMemoryClient, SqliteClient} from './sqlite_client'
import {RowSelectGenerator, ScalarSelectGenerator, SingleRowSelectGenerator} from '../queries/select_generators'

type ExtractTypeParameterFromSelectGenerator<T> = T extends ScalarSelectGenerator<infer V>|SingleRowSelectGenerator<infer V>|RowSelectGenerator<infer V> ? V : never

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

    parallelGet<T extends {[K in keyof T]: ScalarSelectGenerator<any>|SingleRowSelectGenerator<any>|RowSelectGenerator<any>}, K extends string>(queries: T): Promise<{ [K in keyof T]: ExtractTypeParameterFromSelectGenerator<T[K]> }> {
        const promises = Object.keys(queries)
            .map(key =>
                this
                    .get(queries[key])
                    .then(result => [key, result] as [string, any])
            )

        return Promise
            .all(promises)
            .then(results =>
                results.reduce(
                    (acc, [key, result]) => {
                        acc[key] = result
                        return acc
                    },
                    {} as { [K in keyof T]: ExtractTypeParameterFromSelectGenerator<T[K]> })
            )
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