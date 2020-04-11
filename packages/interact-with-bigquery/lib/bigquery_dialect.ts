import {adaptDistinct, Dialect, GroupSelectStatement, SelectStatement} from '@fairscript/interact'

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