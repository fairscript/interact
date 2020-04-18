import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'
import {adaptDistinct} from '@fairscript/interact/dist/lib/databases/ensuring_columns_in_select_distinct_clause_are_referenced_in_order_clause'
import {Value} from '@fairscript/interact/lib/value'
import {ValueRecord} from '@fairscript/interact/lib/record'

export const bigQueryDialect: Dialect = {
    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false,

    generateConvertToInteger(getColumn: string): string {
        return `CAST(${getColumn} AS INT64)`;
    },

    generateConvertToFloat(getColumn: string): string {
        return `CAST(${getColumn} AS FLOAT64)`;
    },

    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        if(statement.kind === 'select-statement' && statement.distinct) {
            return adaptDistinct(statement)
        }
        else {
            return statement
        }
    },
    adaptRows<T>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T[]> {
        return promisedResult
    },
    adaptScalar<T extends Value>(promisedResult: Promise<T>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T> {
        return promisedResult
    },
    adaptSetOfRows<T extends { [p: string]: ValueRecord }>(promisedResult: Promise<T>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T> {
        return promisedResult
    },
    adaptSetsOfRows<T extends { [p: string]: ValueRecord }>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T[]> {
        return promisedResult
    },
    adaptSingleRow<T extends ValueRecord>(promisedResult: Promise<T>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T> {
        return promisedResult
    },
    adaptVector<T extends Value>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T[]> {
        return promisedResult
    }
}