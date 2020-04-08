import {extractLambdaParametersAndExpression} from './functions/lambda_parsing'
import {createGetColumnParser, GetColumn} from './value_expressions/get_column_parsing'
import {computeTableAlias, mapParameterNamesToTableAliases} from '../generation/table_aliases'

export interface JoinExpression {
    tableName: string
    left: LeftSideOfJoin
    right: RightSideOfJoin
}

export interface LeftSideOfJoin {
    tableParameterToTableAlias: {[parameter: string]: string}
    getColumn: GetColumn
    kind: 'left-side-of-join'
}

export function createLeftSideOfJoin(tableParameterToTableAlias: {[parameter: string]: string}, getColumn: GetColumn): LeftSideOfJoin {
    return {
        tableParameterToTableAlias,
        getColumn,
        kind: 'left-side-of-join'
    }
}

function parseLeftSide(f: Function): LeftSideOfJoin {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(parameters)

    const parser = createGetColumnParser(parameters)
    const getColumn = parser.run(expression).result

    return createLeftSideOfJoin(tableParameterToTableAlias, getColumn)
}

export interface RightSideOfJoin {
    tableAlias: string
    getColumn
    kind: 'right-side-of-join'
}

export function createRightSideOfJoin(tableAlias: string, getColumn: GetColumn): RightSideOfJoin {
    return {
        tableAlias,
        getColumn,
        kind: 'right-side-of-join'
    }
}

function parseRightSide(f: Function, nthJoin: number): RightSideOfJoin {
    const {parameters, expression} = extractLambdaParametersAndExpression(f)

    const tableAlias = computeTableAlias('t', nthJoin)
    const getColumn = createGetColumnParser(parameters).run(expression).result

    return createRightSideOfJoin(tableAlias, getColumn)
}

export function parseJoin(tableName: string, left: Function, right: Function, nthJoin: number): JoinExpression {
    return {
        tableName,
        left: parseLeftSide(left),
        right: parseRightSide(right, nthJoin)
    }
}