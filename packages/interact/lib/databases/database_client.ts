import {ValueRecord} from '../record'
import {Value} from '../value'

export interface DatabaseClient {
    getScalar<T extends Value>(sql: string, parameters: ValueRecord): Promise<T>

    getVector<T extends Value>(sql: string, parameters: ValueRecord): Promise<T[]>

    getSingleRow<T extends ValueRecord>(sql: string, parameters: ValueRecord): Promise<T>

    getRows<T extends ValueRecord>(sql: string, parameters: ValueRecord): Promise<T[]>
}