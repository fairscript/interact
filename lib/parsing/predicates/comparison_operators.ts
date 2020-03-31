export type SqlComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<='
export const jsComparisonOperators = ['===', '==', '!==', '!=', '>=', '<=', '>', '<']

export function mapJsComparisonOperatorToSqlComparisonOperator(operator): SqlComparisonOperator {
    switch (operator) {
        case '===':
        case '==':
            return '='
        case '!==':
        case '!=':
            return '!='
        default:
            return operator
    }
}