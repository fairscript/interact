import {Dialect} from '../dialects'
import {adaptDistinct} from '../distinct_adaptation'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'

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