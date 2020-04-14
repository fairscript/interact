import {DatabaseClient} from './database_client'
import {Dialect} from './dialects'
import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'
import {generateSelectStatementParameters, generateSelectStatementSql} from '../generation/select_statement_generation'
import {ValueRecord} from '../record'

type ClientInstruction =
    | 'scalar' | 'vector'
    | 'guarantee-single-row' | 'expect-single-row' | 'rows'
    | 'guarantee-set-of-rows' | 'expect-set-of-rows' | 'sets-of-rows'

export interface Runnable<T> {
    statement: SelectStatement|GroupSelectStatement
    clientInstruction: ClientInstruction
}

type ExtractTypeParameterFromRunnable<T> = T extends Runnable<infer V> ? V : never

function mapFlattenedRowToSetOfRows<T extends ValueRecord>(row: T): {[set: string]: ValueRecord} {
    let previousSet : string|null = null

    return Object.keys(row).reduce(
        (acc, alias) => {
            const [set, column] = alias.split('_', 2)

            if (previousSet === null || set !== previousSet) {
                acc[set] = {}
            }
            acc[set][column] = row[alias]

            previousSet = set

            return acc
        },
        {})
}

export class DatabaseContext {
    constructor(private client: DatabaseClient, private dialect: Dialect) {}

    get<T>(sql: string, parameters: ValueRecord, instruction: ClientInstruction, statement: SelectStatement|GroupSelectStatement): Promise<T> {
        switch (instruction) {
            case 'scalar':
                return this.dialect.adaptScalar(this.client.getScalar(sql, parameters), statement) as Promise<any>
            case 'vector':
                return this.dialect.adaptVector(this.client.getVector(sql, parameters), statement) as Promise<any>
            case 'expect-single-row':
                const promiseOfSingleRow = this.client.getRows(sql, parameters)
                    .then(rows => {
                        if (rows.length == 1) {
                            return rows[0]
                        }
                        else if (rows.length == 1) {
                            throw Error('Expected a single row, but retrieved more than one.')
                        }
                        else {
                            throw Error('Expected a single row, but none have been retrieved.')
                        }
                    })

                return this.dialect.adaptSingleRow(promiseOfSingleRow, statement) as Promise<any>
            case 'guarantee-single-row':
                return this.dialect.adaptSingleRow(this.client.getSingleRow(sql, parameters), statement) as Promise<any>
            case 'rows':
                return this.dialect.adaptRows(this.client.getRows(sql, parameters), statement) as Promise<any>
            case 'guarantee-set-of-rows':
                const promiseOfGuaranteedSetOfRows = this.client
                    .getSingleRow(sql, parameters)
                    .then(mapFlattenedRowToSetOfRows)

                return this.dialect.adaptSetOfRows(promiseOfGuaranteedSetOfRows, statement) as Promise<any>
            case 'expect-set-of-rows':
                const promiseOfExpectedSetOfRows = this.client.getRows(sql, parameters)
                    .then(rows => {
                        if (rows.length == 1) {
                            return rows[0]
                        }
                        else if (rows.length == 1) {
                            throw Error('Expected a single set of rows, but retrieved more than one')
                        }
                        else {
                            throw Error('Expected a single set of rows, but none have been retrieved.')
                        }
                    })
                    .then(mapFlattenedRowToSetOfRows)

                return this.dialect.adaptSetOfRows(promiseOfExpectedSetOfRows, statement) as Promise<any>
            case 'sets-of-rows':
                const promiseOfSetsOfRows = this.client
                    .getRows(sql, parameters)
                    .then(rows => rows.map(row => mapFlattenedRowToSetOfRows(row)))
                return this.dialect.adaptSetsOfRows(promiseOfSetsOfRows, statement) as Promise<any>
        }
    }

    run<T>({ statement, clientInstruction }: Runnable<T>): Promise<T> {
        const adaptedStatement = this.dialect.adaptSelectStatement(statement)

        const sql = generateSelectStatementSql(this.dialect, adaptedStatement)
        const parameters = generateSelectStatementParameters(this.dialect, adaptedStatement)

        return this.get(sql, parameters, clientInstruction, statement) as Promise<any>
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