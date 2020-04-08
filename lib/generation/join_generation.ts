import {JoinExpression, LeftSideOfJoin, RightSideOfJoin} from '../parsing/join_parsing'
import {generateGetColumn} from './value_expressions/get_column_generation'


function generateLeftSideOfJoin(side: LeftSideOfJoin): string {
    return generateGetColumn(side.tableParameterToTableAlias, side.getColumn)
}

function generateRightSideOfJoin(side: RightSideOfJoin): string {
    const {getColumn, tableAlias} = side

    return generateGetColumn({[getColumn.object]: tableAlias}, getColumn)
}

function generateSidesOfJoin(left: LeftSideOfJoin, right: RightSideOfJoin): string {
    return `${generateLeftSideOfJoin(left)} = ${generateRightSideOfJoin(right)}`
}

export function generateInnerJoin(joinExpression: JoinExpression): string {
    const {tableName, left, right} = joinExpression

    return `INNER JOIN ${tableName} ${right.tableAlias} ON ${generateSidesOfJoin(left, right)}`
}

export function generateJoins(joinExpressions: JoinExpression[]): string[] {
    return joinExpressions.map(generateInnerJoin)
}