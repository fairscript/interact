import {GetColumn} from '../parsing/value_expressions/get_column_parsing'
import {AggregateColumn} from '../parsing/aggregation/aggregate_column_parsing'
import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'
import {GroupAggregationOperation} from '../parsing/aggregation/group_aggregation_operation_parsing'
import {TableAggregationOperation} from '../parsing/aggregation/table_aggregation_operation_parsing'
import {ColumnType} from '../queries/one/table'
import {collectColumnTypeRecords, ColumnTypeRecord} from '../record'
import {CountOperation, createCountOperation} from '../parsing/count_operation_parsing'
import {SubselectStatement} from '../statements/subselect_statement'
import {GetPartOfKey} from '../parsing/aggregation/get_part_of_key_parsing'
import {Key} from '../parsing/get_key_parsing'
import {
    AdaptBooleanAsInteger,
    ConvertToInteger
} from '../parsing/conversions'

export type ColumnTypeMapping = [ColumnType, ColumnType]
export type ColumnTypeMappingRecord = Record<string, ColumnTypeMapping>

export function determineOperationColumnTypeMapping(
    columnTypeRecords: ColumnTypeRecord[],
    parameterNameToTableAlias: {[parameter: string]: string},
    op: GetPartOfKey|CountOperation|GetColumn|AggregateColumn|SubselectStatement|ConvertToInteger|AdaptBooleanAsInteger,
    key: Key|null): [ColumnType, ColumnType] {

    switch (op.kind) {
        case 'get-column':
            const {object, property} = op

            const tableAlias = parameterNameToTableAlias[object]
            const tableIndex = parseInt(tableAlias.slice(1))
            const columnTypes = columnTypeRecords[tableIndex - 1]
            const columnType = columnTypes[property]

            return [columnType, columnType]
        case 'count-operation':
            return ['integer', 'integer']
        case 'adapt-boolean-as-integer':
            return ['integer', 'boolean']
        case 'convert-to-integer':
            return ['integer', 'integer']
        case 'aggregate-column':
            if (op.aggregationFunction === 'avg') {
                return ['float', 'float']
            }
            else if (op.aggregationFunction === 'sum') {
                const [inner, _] = determineOperationColumnTypeMapping(columnTypeRecords, parameterNameToTableAlias, op.aggregated, null)

                if (inner === 'boolean' || inner === 'integer') {
                    return ['integer', 'integer']
                }
                else {
                    return ['float', 'float']
                }
            }
            else {
                return determineOperationColumnTypeMapping(columnTypeRecords, parameterNameToTableAlias, op.aggregated, null)
            }
        case 'get-part-of-key':
            // Recall that a part of key consists of an alias and a GetColumn operation.
            // Further, note that key provides a parameter name to table alias mapping.
            const {partsOfKey, parameterToTable} = key!
            // op.part refers to the alias from the groupBy method, not the alias from the aggregate method.
            const keyPart = partsOfKey[partsOfKey.findIndex(p => p.alias === op.part)]

            return determineOperationColumnTypeMapping(columnTypeRecords, parameterToTable, keyPart.get, null)
        case 'subselect-statement':
            switch (op.selection.kind) {
                case 'count-selection':
                    return determineOperationColumnTypeMapping(columnTypeRecords, {}, createCountOperation(), null)
                case 'single-column-selection':
                    return determineOperationColumnTypeMapping(columnTypeRecords, op.selection.parameterNameToTableAlias, op.selection.operation, null)
            }
            break
    }
}

function mapColumnTypeRecordToColumnTypeMappingRecord(input: ColumnTypeRecord): ColumnTypeMappingRecord {
    return Object
        .keys(input)
        .reduce(
            (acc, key) => {
                const columnType = input[key]
                acc[key] = [columnType, columnType]

                return acc
            },
            {})
}

export function determineResultColumnTypeMappings(statement: SelectStatement | GroupSelectStatement): ColumnTypeMapping | ColumnTypeMappingRecord | {[set: string]: ColumnTypeMappingRecord} {
    const selection = statement.selection!

    const columnTypeRecords = collectColumnTypeRecords(statement)

    switch (selection.kind) {
        case 'count-selection':
            return determineOperationColumnTypeMapping(columnTypeRecords, {}, createCountOperation(), null)
        case 'single-column-selection':
            return determineOperationColumnTypeMapping(columnTypeRecords, selection.parameterNameToTableAlias, selection.operation, null)
        case 'single-table-selection':
            return mapColumnTypeRecordToColumnTypeMappingRecord(statement.columns)
        case 'multi-table-selection':
            return selection.names.reduce(
                (acc, name, index) => {
                    const columnTypeRecord = columnTypeRecords[index]
                    acc[name] = mapColumnTypeRecordToColumnTypeMappingRecord(columnTypeRecord)

                    return acc
                },
                {} as {[set: string]: ColumnTypeMappingRecord}
            )
        case 'map-selection':
            return selection.operations.reduce(
                (acc, [alias, op]) => {
                    acc[alias] = determineOperationColumnTypeMapping(columnTypeRecords, selection.parameterNameToTableAlias, op, null)
                    return acc
                },
                {} as ColumnTypeMappingRecord
            )
        case 'table-aggregation-selection':
            return selection.operations.reduce(
                (acc, [alias, op]: [string, TableAggregationOperation]) => {
                    acc[alias] = determineOperationColumnTypeMapping(columnTypeRecords, selection.parameterToTable, op, null)
                    return acc
                },
                {} as ColumnTypeMappingRecord
            )
        case 'group-aggregation-selection':
            const key = (statement as GroupSelectStatement).key
            return selection.operations.reduce(
                (acc, [alias, op]: [string, GroupAggregationOperation]) => {
                    acc[alias] = determineOperationColumnTypeMapping(columnTypeRecords, selection.parameterToTable, op, key)

                    return acc
                },
                {} as ColumnTypeMappingRecord)
        case 'single-group-aggregation-operation-selection':
            return determineOperationColumnTypeMapping(columnTypeRecords, selection.parameterNameToTableAlias, selection.operation, (statement as GroupSelectStatement).key)
    }
}