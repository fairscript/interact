import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'

type SelectStatementAdaptationRule = (statement: SelectStatement|GroupSelectStatement) => SelectStatement|GroupSelectStatement

export interface Dialect {
    aliasEscape: string|null
    namedParameterPrefix: string
    useNamedParameterPrefixInRecord: boolean

    generateConvertToInteger: (getColumn: string) => string
    generateConvertToFloat: (getColumn: string) => string

    selectStatementAdaptionRules: SelectStatementAdaptationRule[]

    clientBooleanResultType: 'boolean'|'number',
    clientFloatResultType: 'number'|'string'
}

