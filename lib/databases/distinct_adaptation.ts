import {createOrderExpression, OrderExpression} from '../parsing/order_parsing'
import {GetSelection} from '../parsing/selection/get_parsing'
import {createKey, createPartOfKey, Key} from '../parsing/get_key_parsing'
import {createAggregateColumn} from '../parsing/selection/aggregation_parsing'
import {SelectStatement} from '../select_statement'
import {MapSelection} from '../parsing/selection/map_parsing'
import {GetColumn} from '../column_operations'

function checkIfGetColumnInOrderIsAbsentFromGetSelection(orders: OrderExpression[], selection: GetSelection): boolean {
    const get = selection.get

    for (let indexOrder in orders) {
        const order = orders[indexOrder]
        const operation = order.operation

        if(operation.kind !== 'get-column') {
            continue
        }

        if (order.parameterNameToTableAlias[operation.object] !== selection.parameterNameToTableAlias[get.object] &&
            operation.property === get.property) {
            return true
        }
    }

    return false
}

function checkIfGetColumnInOrderIsAbsentFromMapSelection(orders: OrderExpression[], selection: MapSelection): boolean {
    for (let indexOrder in orders) {
        const order = orders[indexOrder]
        const orderOperation = order.operation

        if(orderOperation.kind !== 'get-column') {
            continue
        }

        for (let indexMap in selection.operations) {
            const [alias, mapOperation] = selection.operations[indexMap]

            if(mapOperation.kind !== 'get-column') {
                continue
            }

            if (order.parameterNameToTableAlias[orderOperation.object] !== selection.parameterNameToTableAlias[mapOperation.object] &&
                orderOperation.property === mapOperation.property) {
                return true
            }
        }
    }

    return false
}

function mapGetColumnToAggregateColumn(orders: OrderExpression[]) {
    return orders.map(o => {
        const operation = o.operation
        switch (operation.kind) {
            case 'aggregate-column':
                return o
            case 'get-column':
                switch (o.direction) {
                    case 'asc':
                        return createOrderExpression(o.parameterNameToTableAlias, createAggregateColumn('min', operation), 'asc')
                    case 'desc':
                        return createOrderExpression(o.parameterNameToTableAlias, createAggregateColumn('max', operation), 'desc')
                }
        }
    })
}

function adaptOrderedDistinct(statement: SelectStatement, key: Key) {
    // Replace GetColumn order operations with MIN/MAX operations
    const adaptedOrderExpressions: OrderExpression[] = mapGetColumnToAggregateColumn(statement.orders)

    const adaptedSelectedStatement = {
        ...statement,
        distinct: false,
        key,
        orders: adaptedOrderExpressions
    }

    return adaptedSelectedStatement
}

export function adaptDistinct(statement: SelectStatement): SelectStatement {

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