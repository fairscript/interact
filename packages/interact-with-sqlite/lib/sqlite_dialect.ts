import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'


export const sqliteDialect: Dialect = {
    aliasEscape: null,
    namedParameterPrefix: '$',
    useNamedParameterPrefixInRecord: true,

    clientBooleanResultType: 'number',
    clientFloatResultType: 'number',

    generateConvertToInteger(getColumn: string): string {
        return `CAST(${getColumn} AS integer)`
    },

    generateConvertToFloat(getColumn: string): string {
        return `CAST(${getColumn} AS float)`
    },

    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        return statement
    }


}