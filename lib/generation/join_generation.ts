import {JoinExpression} from '../parsing/join_parsing'
import {joinWithNewLine} from '../parsing/javascript_parsing'
import {generateGet} from './column_generation'

function generateJoinExpression(expr: JoinExpression, index: number): string {
    return `INNER JOIN ${expr.tableName} t${index+2} ON ${generateGet(expr.left)} = ${generateGet(expr.right)}`
}

function generateJoinExpressions(joinExpressions: JoinExpression[]): string {
    return joinWithNewLine(joinExpressions.map(generateJoinExpression))
}

export function generateInnerJoin(joinExpressions: JoinExpression[]) {
    return generateJoinExpressions(joinExpressions)
}