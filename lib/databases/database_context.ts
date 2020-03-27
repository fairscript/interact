import {DatabaseClient} from './database_client'
import {Dialect} from './dialects'
import {SelectScalar} from '../queries/selections/select_scalar'
import {SelectSingleRow} from '../queries/selections/select_single_row'
import {SelectRows} from '../queries/selections/select_rows'
import {generateSelectStatementParameters, generateSelectStatementSql} from '../generation/select_statement_generation'

type ExtractTypeParameterFromSelection<T> = T extends SelectScalar<infer V>|SelectSingleRow<infer V>|SelectRows<infer V> ? V : never

export class DatabaseContext {
    constructor(private client: DatabaseClient, private dialect: Dialect) {}

    get<T>(select: SelectSingleRow<T>): Promise<T>
    get<T>(select: SelectScalar<T>): Promise<T>
    get<T>(select: SelectRows<T>): Promise<T[]>
    get<T>(select: SelectScalar<T>|SelectSingleRow<T>|SelectRows<T>): Promise<T>|Promise<T[]> {
        const sql = generateSelectStatementSql(this.dialect, select.statement)
        const parameters = generateSelectStatementParameters(this.dialect, select.statement)

        switch (select.kind) {
            case 'scalar-select-generator':
                return this.client.getScalar<T>(sql, parameters)
            case 'single-row-select-generator':
                return this.client.getSingleRow<T>(sql, parameters)
            case 'row-select-generator':
                return this.client.getRows<T>(sql, parameters)
        }
    }

    parallelGet<T extends {[K in keyof T]: SelectScalar<any>|SelectSingleRow<any>|SelectRows<any>}, K extends string>(queries: T): Promise<{ [K in keyof T]: ExtractTypeParameterFromSelection<T[K]> }> {
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
                    {} as { [K in keyof T]: ExtractTypeParameterFromSelection<T[K]> })
            )
    }
}