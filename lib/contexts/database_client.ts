export interface DatabaseClient {
    run(sql: string): Promise<void>
    runBatch(sql: string, batch: any[][]): Promise<void>

    getRows<T>(sql: string): Promise<T[]>
    getSingleRow<T>(sql: string): Promise<T>
    getScalar<T>(sql: string): Promise<T>
}