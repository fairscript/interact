import {Dialect, SelectStatement, GroupSelectStatement} from '@fairscript/interact'

export const sqliteDialect: Dialect = {
    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        return statement
    },
    aliasEscape: null,
    namedParameterPrefix: '$',
    useNamedParameterPrefixInRecord: true
}