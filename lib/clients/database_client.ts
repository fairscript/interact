import {StringValueRecord} from '../record'

export interface DatabaseClient {
    getScalar<T>(sql: string, parameters: StringValueRecord): Promise<T>
    getSingleRow<T>(sql: string, parameters: StringValueRecord): Promise<T>
    getRows<T>(sql: string, parameters: StringValueRecord): Promise<T[]>
}