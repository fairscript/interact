import {Dialect} from '../dialects'
import {GroupSelectStatement, SelectStatement} from '../../select_statement'
import {adaptDistinct} from '../distinct_adaptation'

export const bigQueryDialect: Dialect = {
    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false,

    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        if(statement.kind === 'select-statement' && statement.distinct) {
            return adaptDistinct(statement)
        }
        else {
            return statement
        }
    }
}