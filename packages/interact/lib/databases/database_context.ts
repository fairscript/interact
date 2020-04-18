import {DatabaseClient} from './database_client'
import {Dialect} from './dialects'
import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'
import {generateSelectStatementParameters, generateSelectStatementSql} from '../generation/select_statement_generation'
import {ValueRecord} from '../record'
import {ColumnTypeMapping, ColumnTypeMappingRecord, determineResultColumnTypeMappings} from './result_columns'
import {
    adaptResultTypeInPromisedRow,
    adaptResultTypeInPromisedRows,
    adaptResultTypeInPromisedVector,
    adaptResultTypeOfPromisedScalar,
    adaptResultTypesInPromisedSetOfRows,
    adaptResultTypesInPromisedSetsOfRows,
    createAdaptClientResultTypeOfValue,
    createAdaptResultTypesInSetOfRow,
    createAdaptResultTypesInValueRecord
} from './client_result_type_adaptation'

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

    get<T>(
        sql: string,
        parameters: ValueRecord,
        instruction: ClientInstruction,
        statement: SelectStatement|GroupSelectStatement): Promise<T> {

        const resultColumnTypeMappings = determineResultColumnTypeMappings(statement)

        const { clientBooleanResultType, clientFloatResultType } = this.dialect

        switch (instruction) {
            case 'scalar':
            case 'vector':
                const adaptClientResultTypeOfValue = createAdaptClientResultTypeOfValue(clientBooleanResultType, clientFloatResultType, resultColumnTypeMappings as ColumnTypeMapping)

                if (instruction === 'scalar') {
                    return adaptResultTypeOfPromisedScalar(this.client.getScalar(sql, parameters), adaptClientResultTypeOfValue) as Promise<any>
                }
                else {
                    return adaptResultTypeInPromisedVector(this.client.getVector(sql, parameters), adaptClientResultTypeOfValue) as Promise<any>
                }
            case 'expect-single-row':
            case 'guarantee-single-row':
            case 'rows':
                const adaptClientResultTypeOfValueRecord = createAdaptResultTypesInValueRecord(clientBooleanResultType, clientFloatResultType, resultColumnTypeMappings as ColumnTypeMappingRecord)

                if (instruction === 'expect-single-row') {
                    const promiseOfExpectedSingleRow = this.client.getRows(sql, parameters)
                        .then(rows => {
                            if (rows.length === 1) {
                                return rows[0]
                            }
                            else if (rows.length > 1) {
                                throw Error('Expected a single row, but retrieved more than one.')
                            }
                            else {
                                throw Error('Expected a single row, but none have been retrieved.')
                            }
                        })
                    return adaptResultTypeInPromisedRow(promiseOfExpectedSingleRow, adaptClientResultTypeOfValueRecord) as Promise<any>
                }
                else if (instruction === 'guarantee-single-row') {
                    const promiseOfGuaranteedSingleRow = this.client.getSingleRow(sql, parameters)

                    return adaptResultTypeInPromisedRow(promiseOfGuaranteedSingleRow, adaptClientResultTypeOfValueRecord) as Promise<any>
                }
                else {
                    const promiseOfRows = this.client.getRows(sql, parameters)

                    return adaptResultTypeInPromisedRows(promiseOfRows, adaptClientResultTypeOfValueRecord) as Promise<any>
                }
            case 'guarantee-set-of-rows':
            case 'expect-set-of-rows':
            case 'sets-of-rows':
                const adaptResultTypesInSetOfRow = createAdaptResultTypesInSetOfRow(clientBooleanResultType, clientFloatResultType, resultColumnTypeMappings as {[set: string]: ColumnTypeMappingRecord})

                if (instruction === 'guarantee-set-of-rows') {
                    const promiseOfGuaranteedSetOfRows = this.client
                        .getSingleRow(sql, parameters)
                        .then(mapFlattenedRowToSetOfRows)

                    return adaptResultTypesInPromisedSetOfRows(promiseOfGuaranteedSetOfRows, adaptResultTypesInSetOfRow) as Promise<any>
                }
                else if (instruction === 'expect-set-of-rows') {
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

                    return adaptResultTypesInPromisedSetOfRows(promiseOfExpectedSetOfRows, adaptResultTypesInSetOfRow) as Promise<any>
                }
                else {
                    const promiseOfSetsOfRows = this.client
                        .getRows(sql, parameters)
                        .then(rows => rows.map(row => mapFlattenedRowToSetOfRows(row)))

                    return adaptResultTypesInPromisedSetsOfRows(promiseOfSetsOfRows, adaptResultTypesInSetOfRow) as Promise<any>
                }
        }
    }

    run<T>({ statement, clientInstruction }: Runnable<T>): Promise<T> {
        const adaptedStatement = this.dialect.adaptSelectStatement(statement)

        const sql = generateSelectStatementSql(this.dialect, adaptedStatement)
        const parameters = generateSelectStatementParameters(this.dialect, adaptedStatement)

        return this.get(sql, parameters, clientInstruction, adaptedStatement) as Promise<any>
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