import {Dialect} from '../dialects'
import {GroupSelectStatement, SelectStatement} from '../../select_statement'

export const sqliteDialect: Dialect = {
    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        return statement
    },
    aliasEscape: null,
    namedParameterPrefix: '$',
    useNamedParameterPrefixInRecord: true
}