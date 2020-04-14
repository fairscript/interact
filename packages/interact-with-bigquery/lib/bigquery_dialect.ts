import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'
import {adaptDistinct} from '@fairscript/interact/lib/databases/distinct_adaptation'
import {Value} from '@fairscript/interact/lib/value'
import {ValueRecord} from '@fairscript/interact/lib/record'

export const bigQueryDialect: Dialect = {
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
    },

    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false,
}