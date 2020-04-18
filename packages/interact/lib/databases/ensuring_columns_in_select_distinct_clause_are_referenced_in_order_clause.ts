import {OrderExpression} from '../parsing/sorting/sorting_parsing'
import {createKey, createPartOfKey, Key} from '../parsing/get_key_parsing'
import {MapSelection} from '../parsing/selection/map_selection_parsing'
import {createAggregateColumn} from '../parsing/aggregation/aggregate_column_parsing'
import {createGroupOrderExpression} from '../parsing/sorting/group_sorting_parsing'
import {SingleColumnSelection} from '../parsing/selection/single_column_selection_parsing'
import {GetColumn} from '../parsing/value_expressions/get_column_parsing'
import {SelectStatement} from '../statements/select_statement'
import {
    createEmptyGroupSelectStatement,
    GroupSelectStatement
} from '../statements/group_select_statement'
import {Filter} from '../parsing/filtering/filter_parsing'
import {ColumnTypeRecord} from '../record'
import {JoinExpression} from '../parsing/join_parsing'
import {createGroupAggregation} from '../parsing/selection/group_aggregation_selection_parsing'
import {createGetPartOfKey} from '../parsing/aggregation/get_part_of_key_parsing'
import {GroupSelection} from '../parsing/selection/selection_parsing'
import {GroupAggregationOperation} from '../parsing/aggregation/group_aggregation_operation_parsing'
import {createSingleGroupAggregationOperationSelection} from '../parsing/selection/single_group_aggregation_operation_selection'

function checkIfColumnsReferencedInOrderClauseAreAbsentFromSelectClause(orders: OrderExpression[], selection: SingleColumnSelection|MapSelection): boolean {
    for (let indexOrder in orders) {
        const order = orders[indexOrder]
        const orderOperation = order.get

        for (let indexMap in selection.referencedColumns) {
            const selectOperation = selection.referencedColumns[indexMap]

            if (order.parameterNameToTableAlias[orderOperation.object] !== selection.parameterNameToTableAlias[selectOperation.object] ||
                orderOperation.property !== selectOperation.property) {
                return true
            }
        }
    }

    return false
}

// Replace GetColumn order operations with MIN/MAX operations
function mapOrderExpressionsToGroupOrderExpressions(key: Key, orders: OrderExpression[]) {
    return orders.map(({ parameterNameToTableAlias, get, direction }) => {
        switch (direction) {
            case 'asc':
                return createGroupOrderExpression(parameterNameToTableAlias, createAggregateColumn('min', get), 'asc')
            case 'desc':
                return createGroupOrderExpression(parameterNameToTableAlias, createAggregateColumn('max', get), 'desc')
        }
    })
}

function mapTableSelectionToGroupSelection(tableSelection: SingleColumnSelection|MapSelection): GroupSelection {
    const {parameterNameToTableAlias} = tableSelection

    switch (tableSelection.kind) {
        case 'single-column-selection':
            const {operation} = tableSelection
            const getColumnOrConvertColumn = operation.kind === 'aggregate-column' ? operation.aggregated : operation
            const getColumn = getColumnOrConvertColumn.kind === 'implicitly-convert-boolean-to-integer' ? getColumnOrConvertColumn.get : getColumnOrConvertColumn

            return createSingleGroupAggregationOperationSelection(parameterNameToTableAlias, createGetPartOfKey(getColumn.property))
        case 'map-selection':
            const operations: [string, GroupAggregationOperation][] = tableSelection.operations.map(([alias, op]) => {
                switch (op.kind) {
                    case 'get-column':
                        return [alias, createGetPartOfKey(getColumn.property)]
                    case 'subselect-statement':
                        return [alias, op]
                }
            })

            return createGroupAggregation(parameterNameToTableAlias, operations)
    }
}

function adaptOrderedDistinct(
    tableName: string,
    columns: ColumnTypeRecord,
    tableSelection: SingleColumnSelection|MapSelection,
    joins: JoinExpression[],
    filters: Filter[],
    orders: OrderExpression[],
    limit: number|'all',
    offset: number,
    parameterNameToTableAlias: {[parameter: string]: string},
    referencedColumns: GetColumn[]): GroupSelectStatement {

    const key = createKey(
        parameterNameToTableAlias,
        referencedColumns
            .map(operation =>
                createPartOfKey(
                    operation.property,
                    operation
                )
            )
    )

    const groupSelection = mapTableSelectionToGroupSelection(tableSelection)

    return {
        ...createEmptyGroupSelectStatement(tableName, columns, key),
        filters,
        joins,
        selection: groupSelection,
        limit,
        offset,
        orders: mapOrderExpressionsToGroupOrderExpressions(key, orders),
        distinct: false
    }
}

export function ensureColumnsInSelectDistinctClauseAreReferencedInOrderClauseRule(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
    if(statement.kind !== 'select-statement') {
        return statement
    }

    if (!statement.distinct) {
        return statement
    }

    const selection = statement.selection!

    if (selection.kind !== 'single-column-selection' && selection.kind !== 'map-selection') {
        return statement
    }

    const {orders} = statement

    if (!checkIfColumnsReferencedInOrderClauseAreAbsentFromSelectClause(orders, selection)) {
        return statement
    }

    const {tableName, columns, joins, filters, limit, offset} = statement
    const {parameterNameToTableAlias, referencedColumns} = selection

    return adaptOrderedDistinct(
        tableName,
        columns,
        selection,
        joins,
        filters,
        orders,
        limit,
        offset,
        parameterNameToTableAlias,
        referencedColumns)

}