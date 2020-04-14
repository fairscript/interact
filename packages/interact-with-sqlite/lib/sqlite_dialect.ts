import {Dialect} from '@fairscript/interact/lib/databases/dialects'
import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'
import {ValueRecord} from '@fairscript/interact/lib/record'
import {Value} from '@fairscript/interact/lib/value'
import {findBooleanResultColumns} from './search_for_boolean_result_columns'
import {
    createMapNumberValuesInRowToBooleans,
    createMapNumberValuesInSetOfRowsToBooleans,
    mapNumberToBoolean
} from './number_to_boolean_mapping'


export const sqliteDialect: Dialect = {
    adaptSelectStatement(statement: SelectStatement|GroupSelectStatement): SelectStatement|GroupSelectStatement {
        return statement
    },

    adaptScalar<T extends Value>(promisedResult: Promise<T>, statement: SelectStatement | GroupSelectStatement): Promise<T> {
        if(findBooleanResultColumns(statement) as boolean) {
            return promisedResult
                .then(scalar => mapNumberToBoolean(scalar as any)) as Promise<T>
        }
        else {
            return promisedResult
        }
    },

    adaptVector<T extends Value>(promisedResult: Promise<T[]>, statement: SelectStatement | GroupSelectStatement): Promise<T[]> {
        if(findBooleanResultColumns(statement) as boolean) {
            return promisedResult
                .then(vector => vector.map(entry => mapNumberToBoolean(entry as any))) as Promise<T[]>
        }
        else {
            return promisedResult
        }
    },

    adaptSingleRow<T extends ValueRecord>(promisedResult: Promise<T>, statement: SelectStatement | GroupSelectStatement): Promise<T> {
        const booleanResultColumns = findBooleanResultColumns(statement) as string[]
        const map = createMapNumberValuesInRowToBooleans(booleanResultColumns)

        return promisedResult
            .then(res => map(res as any)) as Promise<T>
    },

    adaptRows<T>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement | GroupSelectStatement): Promise<T[]> {
        const booleanResultColumns = findBooleanResultColumns(adaptedSelectStatement) as string[]
        const map = createMapNumberValuesInRowToBooleans(booleanResultColumns)

        return promisedResult
            .then(rows => rows.map(row => map(row as any))) as Promise<T[]>
    },

    adaptSetOfRows<T extends {[set: string]: ValueRecord}>(promisedResult: Promise<T>, adaptedSelectStatement: SelectStatement|GroupSelectStatement): Promise<T> {
        const booleanResultColumns = findBooleanResultColumns(adaptedSelectStatement) as {[set: string]: string[]}
        const map = createMapNumberValuesInSetOfRowsToBooleans(booleanResultColumns)

        return promisedResult
            .then(set => map(set as any)) as Promise<any>
    },

    adaptSetsOfRows<T extends {[set: string]: ValueRecord}>(promisedResult: Promise<T[]>, adaptedSelectStatement: SelectStatement|GroupSelectStatement): Promise<T[]> {
        const booleanResultColumns = findBooleanResultColumns(adaptedSelectStatement) as {[set: string]: string[]}
        const map = createMapNumberValuesInSetOfRowsToBooleans(booleanResultColumns)

        return promisedResult
            .then(sets => sets.map(set => map(set as any))) as Promise<any>
    },

    aliasEscape: null,

    namedParameterPrefix: '$',

    useNamedParameterPrefixInRecord: true
}