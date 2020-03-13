import {ColumnOperation} from '../column_operations'
import {generateColumnOperations} from './column_generation'

export function generateSelect (operations: Array<ColumnOperation>): string {
    return 'SELECT ' + generateColumnOperations(operations)
}