import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'
import {ColumnRecord} from '@fairscript/interact/lib/record'
import {GetColumn} from '@fairscript/interact/lib/parsing/value_expressions/get_column_parsing'
import {AggregateColumn} from '@fairscript/interact/lib/parsing/aggregation/aggregate_column_parsing'
import {TableAggregationOperation} from '@fairscript/interact/lib/parsing/aggregation/table_aggregation_operation_parsing'
import {GroupAggregationOperation} from '@fairscript/interact/lib/parsing/aggregation/group_aggregation_operation_parsing'

function createCheckIfOperationRefersToBooleanColumn(
    tableColumnLists: ColumnRecord[]): (op: GetColumn|AggregateColumn, parameterNameToTableAlias: {[parameter: string]: string}) => boolean {

    function f(op: GetColumn|AggregateColumn, parameterNameToTableAlias: {[parameter: string]: string}) {
        const {object, property} = op.kind === 'get-column' ? op : op.get

        const tableAlias = parameterNameToTableAlias[object]
        const tableIndex = parseInt(tableAlias[1])
        const columns = tableColumnLists[tableIndex-1]

        return columns[property] === 'boolean'
    }

    return f
}

export function findBooleanResultColumns(statement: SelectStatement | GroupSelectStatement): boolean | string[] | { [set: string]: string[] } {
    const selection = statement.selection!
    const columnLists = [statement.columns].concat(statement.joins.map(j => j.columns))

    const checkIfOperationRefersToBooleanColumn = createCheckIfOperationRefersToBooleanColumn(columnLists)

    switch (selection.kind) {
        case 'count-selection':
            return false
        case 'single-column-selection':
            return checkIfOperationRefersToBooleanColumn(selection.operation, selection.parameterNameToTableAlias)
        case 'single-table-selection':
            return Object.keys(statement.columns).filter(key => statement.columns[key] === 'boolean')
        case 'multi-table-selection':
            return selection.namesPairedWithProperties.reduce(
                (acc, [name, properties], index) => {
                    const columns = columnLists[index]

                    const booleans = properties.filter(property => columns[property] === 'boolean')
                    if (booleans.length > 0) {
                        acc[name] = booleans
                    }

                    return acc
                },
                {}
            )
        case 'map-selection':
            return selection.operations.reduce(
                (acc: string[], [alias, op]) => {
                    switch (op.kind) {
                        case 'get-column':
                            if (checkIfOperationRefersToBooleanColumn(op, selection.parameterNameToTableAlias)) {
                                acc.push(alias)
                            }
                            break
                        case 'subselect-statement':
                            if (op.selection.kind === 'single-column-selection') {
                                if (checkIfOperationRefersToBooleanColumn(op.selection.operation, op.selection.parameterNameToTableAlias)) {
                                    acc.push(alias)
                                }
                            }
                            break
                    }

                    return acc
                },
                []
            )
        case 'group-aggregation-selection':
            const key = (statement as GroupSelectStatement).key
            // Recall that a part of key consists of an alias and a GetColumn operation.
            // Further, note that key provides a parameter name to table alias mapping.
            const {partsOfKey, parameterToTable} = key

            return selection.operations.reduce(
                (acc, [alias, op]: [string, GroupAggregationOperation]) => {
                    switch (op.kind) {
                        case 'get-part-of-key':
                            // op.part refers to the alias from the groupBy method, not the alias from the aggregate method.
                            const keyPart = partsOfKey[partsOfKey.findIndex(p => p.alias === op.part)]

                            if (checkIfOperationRefersToBooleanColumn(keyPart.get, parameterToTable)) {
                                acc.push(alias)
                            }
                            break
                        case 'aggregate-column':
                            if (checkIfOperationRefersToBooleanColumn(op, selection.parameterToTable)) {
                                acc.push(alias)
                            }
                            break
                        case 'count-operation':
                            break
                    }

                    return acc
                },
                [] as string[])
        case 'table-aggregation-selection':
            return selection.operations.reduce(
                (acc, [alias, op]: [string, TableAggregationOperation]) => {
                    if (op.kind === 'aggregate-column' && checkIfOperationRefersToBooleanColumn(op, selection.parameterToTable)) {
                        acc.push(alias)
                    }

                    return acc
                },
                [] as string[]
            )
    }
}