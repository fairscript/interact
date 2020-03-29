import {OrderExpression} from '../parsing/sorting/sorting_parsing'
import {GetSelection} from '../parsing/selection/get_parsing'
import {createKey, createPartOfKey, Key} from '../parsing/get_key_parsing'
import {createGroupSelectStatement, GroupSelectStatement, SelectStatement} from '../select_statement'
import {MapSelection} from '../parsing/selection/map_parsing'
import {GetColumn} from '../column_operations'
import {createAggregateColumn} from '../parsing/aggregation/aggregate_column_parsing'
import {createGroupOrderExpression} from '../parsing/sorting/group_sorting_parsing'
import {mapPartOfKeyToTableAndProperty} from '../parsing/selection/aggregation_parsing'

function checkIfGetColumnInOrderIsAbsentFromGetSelection(orders: OrderExpression[], selection: GetSelection): boolean {
    const get = selection.get

    for (let indexOrder in orders) {
        const order = orders[indexOrder]
        const operation = order.get

        if (order.parameterNameToTableAlias[operation.object] !== selection.parameterNameToTableAlias[get.object] ||
            operation.property !== get.property) {
            return true
        }
    }

    return false
}

function checkIfGetColumnInOrderIsAbsentFromMapSelection(orders: OrderExpression[], selection: MapSelection): boolean {
    for (let indexOrder in orders) {
        const order = orders[indexOrder]
        const orderOperation = order.get

        for (let indexMap in selection.operations) {
            const [alias, mapOperation] = selection.operations[indexMap]

            if(mapOperation.kind !== 'get-column') {
                continue
            }

            if (order.parameterNameToTableAlias[orderOperation.object] !== selection.parameterNameToTableAlias[mapOperation.object] ||
                orderOperation.property !== mapOperation.property) {
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

function adaptOrderedDistinct(statement: SelectStatement, key: Key): GroupSelectStatement {
    return {
        ...createGroupSelectStatement(statement, key),
        distinct: false,
        orders: mapOrderExpressionsToGroupOrderExpressions(key, statement.orders)
    }
}

export function adaptDistinct(statement: SelectStatement): SelectStatement|GroupSelectStatement {

    const {orders} = statement

    const selection = statement.selection!

    // A single column is selected.
    // Not that "get selection" implies that no key is set.
    if (selection.kind === 'get-selection' && checkIfGetColumnInOrderIsAbsentFromGetSelection(orders, selection)) {
        // Group by the selected column
        const key = createKey(
            selection.parameterNameToTableAlias,
            [
                createPartOfKey(
                    selection.get.property,
                    selection.get
                )
            ]
        )

        return adaptOrderedDistinct(statement, key)

    }
    else if (selection.kind === 'map-selection' && checkIfGetColumnInOrderIsAbsentFromMapSelection(orders, selection)) {
        // Group by the sequence of selected columns
        const key = createKey(
            selection.parameterNameToTableAlias,
            selection
                .operations
                .filter(([alias, operation]) => operation.kind === 'get-column')
                .map(([alias, operation]) =>
                    createPartOfKey(
                        alias,
                        operation as GetColumn
                    )
                )
        )

        return adaptOrderedDistinct(statement, key)
    }
    else {
        return statement
    }

}