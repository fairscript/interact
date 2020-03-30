import {Key} from '../get_key_parsing'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {createRecordInParenthesesParser} from '../javascript/record_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {AggregationOperation, createAggregationOperationParser} from '../aggregation_operation_parsing'


export interface Aggregation {
    kind: 'aggregation',
    partOfKeyToTableAndProperty: {[partOfKey: string]: [string, string]},
    parameterToTable: {[partOfKey: string]: string},

    operations: [string, AggregationOperation][]
}

export function createAggregation(
    partOfKeyToTableAndProperty: {[partOfKey: string]: [string, string]},
    parameterToTable: {[partOfKey: string]: string},
    operations: [string, AggregationOperation][]): Aggregation {

    return {
        kind: 'aggregation',
        partOfKeyToTableAndProperty,
        parameterToTable,
        operations
    }
}

function createAggregationParser(keyParameterName: string, objectParameterNames: string[], countParameter: string|null) {
    const valueParser = createAggregationOperationParser(keyParameterName, objectParameterNames, countParameter)

    return createRecordInParenthesesParser(valueParser)
}

export function mapPartOfKeyToTableAndProperty(key: Key): {[partOfKey: string]: [string, string]} {
    return key.parts.reduce(
        (acc, part) => {
            acc[part.alias] = [key.parameterToTable[part.get.object], part.get.property]

            return acc
        },
        {}
    )
}

export function parseAggregationSelection(f: Function, key: Key, numberOfTables: number): Aggregation {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const partOfKeyToTableAndProperty = mapPartOfKeyToTableAndProperty(key)

    const keyParameterName = parameters[0]
    const objectParameterNames = parameters.slice(1, numberOfTables+1)
    const countParameter = parameters.length > 1 + numberOfTables ? parameters[parameters.length - 1]: null

    const parameterToTable = mapParameterNamesToTableAliases(objectParameterNames)

    const parser = createAggregationParser(keyParameterName, objectParameterNames, countParameter)

    const operations = parser.run(expression).result

    const aggregation = createAggregation(partOfKeyToTableAndProperty, parameterToTable, operations)

    return aggregation
}