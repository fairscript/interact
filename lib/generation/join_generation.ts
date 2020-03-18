import {JoinExpression} from '../parsing/join_parsing'
import {generateGetFromParameter} from './get_from_parameter_generation'

function generateJoinExpression(expr: JoinExpression): string {
    const { tableName, left, right } = expr

    const leftParameter = left.parameter
    const rightParameter = right.parameter

    const leftSql = `${generateGetFromParameter({[leftParameter]: 't1'}, left)}`
    const rightSql = `${generateGetFromParameter({[rightParameter]: 't2'}, right)}`

    return `${tableName} t2 ON ${leftSql} = ${rightSql}`
}

export function generateInnerJoin(joinExpression: JoinExpression): string {
    return `INNER JOIN ${generateJoinExpression(joinExpression)}`
}