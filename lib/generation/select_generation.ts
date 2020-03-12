import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import * as toSnakeCase from 'js-snakecase'
import {AccessKey, Aggregate, Alias, Get, PropertyOperation} from '../parsing/select_parsing'

function generateAggregate(aggregate: Aggregate): string {
    return `${aggregate.aggregation.toUpperCase()}(${generateGet(aggregate.get)})`
}

export function generateGet(get: Get): string {
    return 't1' + '.' + toSnakeCase(get.property)
}

export function generateAlias(alias: Alias): string {
    return `${generatePropertyOperation(alias.operation)} AS ${alias.alias}`
}

function generateAccessKey(accessKey: AccessKey): string {
    return `t1.${toSnakeCase(accessKey.property)} AS ${accessKey.alias}`
}

function generatePropertyOperation(operation: PropertyOperation): string {
    switch (operation.kind) {
        case 'access-key':
            return generateAccessKey(operation)
        case 'aggregate':
            return generateAggregate(operation)
        case 'get':
            return generateGet(operation)
        case 'alias':
            return generateAlias(operation)
    }
}

function generatePropertyOperations(operations: Array<PropertyOperation>): string {
    const items = operations.map(generatePropertyOperation)

    return joinWithCommaWhitespace(items)
}

export function generateSelect (operations: Array<PropertyOperation>): string {
    return 'SELECT ' + generatePropertyOperations(operations)
}