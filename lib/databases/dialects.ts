import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'

export interface Dialect {
    aliasEscape: string|null
    namedParameterPrefix: string
    useNamedParameterPrefixInRecord: boolean
    adaptSelectStatement: (statement: SelectStatement|GroupSelectStatement) => SelectStatement|GroupSelectStatement
}

