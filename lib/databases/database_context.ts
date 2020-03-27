import {DatabaseClient} from './database_client'
import {Dialect} from './dialects'
import {SelectStatement} from '../select_statement'
import {generateSelectStatementParameters, generateSelectStatementSql} from '../generation/select_statement_generation'

export interface Runnable<T> {
    statement: SelectStatement
    client: 'scalar'|'single-row'|'rows'
}

type ExtractTypeParameterFromRunnable<T> = T extends Runnable<infer V> ? V : never

export class DatabaseContext {
    constructor(private client: DatabaseClient, private dialect: Dialect) {}

    run<T>({ statement, client }: Runnable<T>): Promise<T> {
        const sql = generateSelectStatementSql(this.dialect, statement)
        const parameters = generateSelectStatementParameters(this.dialect, statement)

        switch (client) {
            case 'scalar':
                return this.client.getScalar(sql, parameters) as Promise<any>
            case 'single-row':
                return this.client.getSingleRow(sql, parameters) as Promise<any>
            case 'rows':
                return this.client.getRows(sql, parameters) as Promise<any>
        }
    }

    parallelRun<T extends {[K in keyof T]: Runnable<any>}, K extends string>(queries: T): Promise<{ [K in keyof T]: ExtractTypeParameterFromRunnable<T[K]> }> {
        const promises = Object.keys(queries)
            .map(key =>
                this
                    .run(queries[key])
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
                    {} as { [K in keyof T]: ExtractTypeParameterFromRunnable<T[K]> })
            )
    }
}