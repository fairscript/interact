import {Dialect} from '../dialects'
import {SelectStatement} from '../../select_statement'

export const sqliteDialect: Dialect = {
    adaptSelectStatement(statement: SelectStatement): SelectStatement {
        return statement
    },
    aliasEscape: null,
    namedParameterPrefix: '$',
    useNamedParameterPrefixInRecord: true
}