import {DatabaseClient} from './database_client'
import {Dialect} from './dialects'
import {generateSelectStatementParameters, generateSelectStatementSql} from '../generation/select_statement_generation'
import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'

export interface Runnable<T> {
    statement: SelectStatement|GroupSelectStatement
    client: 'scalar'|'vector'|'single-row'|'rows'
}

type ExtractTypeParameterFromRunnable<T> = T extends Runnable<infer V> ? V : never

export class DatabaseContext {
    constructor(private client: DatabaseClient, private dialect: Dialect) {}

    run<T>({ statement, client }: Runnable<T>): Promise<T> {
        const adaptedStatement = this.dialect.adaptSelectStatement(statement)

        const sql = generateSelectStatementSql(this.dialect, adaptedStatement)
        const parameters = generateSelectStatementParameters(this.dialect, adaptedStatement)

        switch (client) {
            case 'scalar':
                return this.client.getScalar(sql, parameters) as Promise<any>
            case 'vector':
                return this.client.getVector(sql, parameters) as Promise<any>
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