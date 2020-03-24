import {StringValueRecord} from '../record'

export interface DatabaseClient {
    run(sql: string): Promise<void>
    runBatch(sql: string, batch: any[][]): Promise<void>

    getScalar<T>(sql: string, parameters: StringValueRecord): Promise<T>
    getSingleRow<T>(sql: string, parameters: StringValueRecord): Promise<T>
    getRows<T>(sql: string, parameters: StringValueRecord): Promise<T[]>
}