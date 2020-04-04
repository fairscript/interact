import {OrderExpression} from '../parsing/sorting/sorting_parsing'
import {createKey, createPartOfKey, Key} from '../parsing/get_key_parsing'
import {createGroupSelectStatement, GroupSelectStatement, SelectStatement} from '../select_statement'
import {MapSelection} from '../parsing/selection/map_selection_parsing'
import {createAggregateColumn} from '../parsing/aggregation/aggregate_column_parsing'
import {createGroupOrderExpression} from '../parsing/sorting/group_sorting_parsing'
import {mapPartOfKeyToTableAndProperty} from '../parsing/selection/group_aggregation_selection_parsing'
import {SingleColumnSelection} from '../parsing/selection/single_column_selection_parsing'
import {GetColumn} from '../parsing/valuexpressions/get_column_parsing'

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
    const partOfKeyToTableAndProperty = mapPartOfKeyToTableAndProperty(key)

    return orders.map(({ parameterNameToTableAlias, get, direction }) => {
        switch (direction) {
            case 'asc':
                return createGroupOrderExpression(partOfKeyToTableAndProperty, parameterNameToTableAlias, createAggregateColumn('min', get), 'asc')
            case 'desc':
                return createGroupOrderExpression(partOfKeyToTableAndProperty, parameterNameToTableAlias, createAggregateColumn('max', get), 'desc')
        }
    })
}

function adaptOrderedDistinct(
    statement: SelectStatement,
    parameterNameToTableAlias: {[parameter: string]: string},
    referencedColumns: GetColumn[]): GroupSelectStatement {

    const key = createKey(
        parameterNameToTableAlias,
        referencedColumns
            .map(operation =>
                createPartOfKey(
                    operation.property,
                    operation as GetColumn
                )
            )
    )

    return {
        ...createGroupSelectStatement(statement, key),
        distinct: false,
        orders: mapOrderExpressionsToGroupOrderExpressions(key, statement.orders)
    }
}

export function adaptDistinct(statement: SelectStatement): SelectStatement|GroupSelectStatement {

    const {orders} = statement

    const selection = statement.selection!

    if ((selection.kind === 'single-column-selection' || selection.kind === 'map-selection') && checkIfColumnsReferencedInOrderClauseAreAbsentFromSelectClause(orders, selection)) {
        return adaptOrderedDistinct(statement, selection.parameterNameToTableAlias, selection.referencedColumns)
    }
    else {
        return statement
    }

}