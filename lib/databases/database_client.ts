import {StringValueRecord} from '../record'
import {Value} from '../value'

export interface DatabaseClient {
    getScalar<T extends Value>(sql: string, parameters: StringValueRecord): Promise<T>
    getSingleRow<T extends StringValueRecord>(sql: string, parameters: StringValueRecord): Promise<T>
    getRows<T extends StringValueRecord>(sql: string, parameters: StringValueRecord): Promise<T[]>
}