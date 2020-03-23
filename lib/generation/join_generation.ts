import {JoinExpression} from '../parsing/join_parsing'
import {generateGetColumn} from './get_column_generation'

function generateJoinExpression(expr: JoinExpression): string {
    const { tableName, left, right } = expr

    const leftParameter = left.object
    const rightParameter = right.object

    const leftSql = `${generateGetColumn({[leftParameter]: 't1'}, left)}`
    const rightSql = `${generateGetColumn({[rightParameter]: 't2'}, right)}`

    return `${tableName} t2 ON ${leftSql} = ${rightSql}`
}

export function generateInnerJoin(joinExpression: JoinExpression): string {
    return `INNER JOIN ${generateJoinExpression(joinExpression)}`
}