import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'
import {Value} from '../value'
import {ValueRecord} from '../record'

export interface Dialect {
    aliasEscape: string|null
    namedParameterPrefix: string
    useNamedParameterPrefixInRecord: boolean
    adaptSelectStatement: (statement: SelectStatement|GroupSelectStatement) => SelectStatement|GroupSelectStatement

    adaptScalar<T extends Value>(promisedResult: Promise<T>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T>
    adaptVector<T extends Value>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T[]>

    adaptSingleRow<T extends ValueRecord>(promisedResult: Promise<T>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T>
    adaptRows<T>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T[]>

    adaptSetOfRows<T extends {[set: string]: ValueRecord}>(promisedResult: Promise<T>, adaptedSelectStatement: SelectStatement|GroupSelectStatement): Promise<T>
    adaptSetsOfRows<T extends {[set: string]: ValueRecord}>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement|GroupSelectStatement): Promise<T[]>
}

