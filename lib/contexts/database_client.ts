import {Value} from '../value'

export interface DatabaseClient {
    run(sql: string): Promise<void>
    runBatch(sql: string, batch: any[][]): Promise<void>

    getRows<T>(sql: string): Promise<T[]>
    getSingleRow<T>(sql: string): Promise<T>
    getScalar<T extends Value>(sql: string): Promise<T>
}