import {MultiTableSelection, Selection, SingleTableSelection} from '../parsing/select_parsing'
import * as toSnakeCase from 'js-snakecase'
import {GetSelection} from '../parsing/get_parsing'
import {Aggregate, Aggregation, GetPartOfKey} from '../parsing/aggregation_parsing'
import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import {MapSelection} from '../parsing/map_parsing'
import {GetFromParameter, Subselect} from '../column_operations'
import {generateGetFromParameter} from './get_from_parameter_generation'
import {generateSubselect} from './subselect_generation'


function generateCountSelection (): string {
    return 'COUNT(*)'
}

function generateSingleTableSelection (selection: SingleTableSelection): string {
    return joinWithCommaWhitespace(selection.properties.map(toSnakeCase).map(column => `t1.${column}`))
}

function generateMultiTableSelection (selection: MultiTableSelection): string {
    const {nameToTable, properties} = selection

    return joinWithCommaWhitespace(properties
        .map(([alias, [name, property]]) => {
            const table = nameToTable[name]
            const column = toSnakeCase(property)
            return `${table}.${column} AS ${alias}`
        }))
}

function generateGetSelection(selection: GetSelection): string {
    return `${selection.table}.${toSnakeCase(selection.property)}`
}

function generateAggregation(aggregation: Aggregation): string {
    const partOfKeyToTable = aggregation.partOfKeyToTableAndProperty
    const parameterToTable = aggregation.parameterToTable
    
    function generateGetPartOfKey(part: string): string {
        const [table, property] = partOfKeyToTable[part]
        const column = toSnakeCase(property)

        return `${table}.${column}`
    }

    function generateAggregate(aggregationOperation: string, parameter: string, property: string): string {
        const table = parameterToTable[parameter]
        const column = toSnakeCase(property)

        return `${aggregationOperation.toUpperCase()}(${table}.${column})`
    }

    function generateUnaliasedAggregationOperation(operation: GetPartOfKey|Aggregate) {
        switch (operation.kind) {
            case 'get-part-of-key':
                return generateGetPartOfKey(operation.part)
            case 'aggregate':
                const {parameter, property} = operation.get
                return generateAggregate(operation.aggregation, parameter, property)
        }
    }

    const columnOperations = aggregation.operations.map(([alias, operation]) =>
        `${generateUnaliasedAggregationOperation(operation)} AS ${alias}`
    )

    return joinWithCommaWhitespace(columnOperations)
}

function generateColumnOperation(parameterToTable: {[parameter: string]: string}, operation: GetFromParameter|Subselect): string {
    switch (operation.kind) {
        case 'get-from-parameter':
            return generateGetFromParameter(parameterToTable, operation)
        case 'subselect':
            return generateSubselect(operation)
    }
}

function generateMapSelection (selection: MapSelection): string {
    const { parameterToTable, operations } = selection

    return joinWithCommaWhitespace(operations.map(([alias, operation]) => {
        return `${generateColumnOperation(parameterToTable, operation)} AS ${alias}`
    }))
}

function generateSelection(selection: Selection): string {
    switch (selection.kind) {
        case 'count-selection':
            return generateCountSelection()
        case 'single-table-selection':
            return generateSingleTableSelection(selection)
        case 'multi-table-selection':
            return generateMultiTableSelection(selection)
        case 'get-selection':
            return generateGetSelection(selection)
        case 'aggregation':
            return generateAggregation(selection)
        case 'map-selection':
            return generateMapSelection(selection)
    }
}

export function generateSelect (selection: Selection): string {
    return 'SELECT ' + generateSelection(selection)
}