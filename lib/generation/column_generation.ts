import {Aggregate, Alias, ColumnOperation, Count, Get} from '../column_operations'
import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import * as toSnakeCase from 'js-snakecase'

export function generateGet(get: Get): string {
    return `t${get.table}.${toSnakeCase(get.column)}`
}

function generateAggregate(aggregate: Aggregate): string {
    return `${aggregate.aggregation.toUpperCase()}(${generateGet(aggregate.get)})`
}

function generateAlias(alias: Alias): string {
    return `${generateColumnOperation(alias.operation)} AS ${alias.alias}`
}

function generateCount(operation: Count): string {
    return 'COUNT(*)';
}

function generateColumnOperation(operation: ColumnOperation): string {
    switch (operation.kind) {
        case 'aggregate':
            return generateAggregate(operation)
        case 'get':
            return generateGet(operation)
        case 'alias':
            return generateAlias(operation)
        case 'count':
            return generateCount(operation)
    }
}

export function generateColumnOperations(operations: Array<ColumnOperation>): string {
    const items = operations.map(generateColumnOperation)

    return joinWithCommaWhitespace(items)
}