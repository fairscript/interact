import {SelectStatement} from '../select_statement'

export interface Dialect {
    aliasEscape: string|null
    namedParameterPrefix: string
    useNamedParameterPrefixInRecord: boolean
    adaptSelectStatement: (statement: SelectStatement) => SelectStatement
}

