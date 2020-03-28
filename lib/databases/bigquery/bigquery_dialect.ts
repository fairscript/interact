import {Dialect} from '../dialects'
import {SelectStatement} from '../../select_statement'
import {adaptDistinct} from '../distinct_adaptation'

export const bigQueryDialect: Dialect = {
    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false,

    adaptSelectStatement(statement: SelectStatement): SelectStatement {
        if (statement.distinct) {
            return adaptDistinct(statement)
        }
        else {
            return statement
        }
    }
}