import {SelectSingleRow} from './select_single_row'
import {LimitRows} from './limit_rows'
import {Runnable} from '../../databases/database_context'
import {Constructor, SelectStatement} from '../../statements/select_statement'
import {createEmptyGroupSelectStatement, GroupSelectStatement} from '../../statements/group_select_statement'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {Table} from '../one/table'
import {SelectVector} from './select_vector'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {SelectScalar} from './select_scalar'
import {createCountSelection} from '../../parsing/selection/count_selection'
import {
    parseAverageSelection,
    parseMaxSelection,
    parseMinSelection,
    parseSumSelection
} from '../../parsing/selection/aggregate_column_select_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {parseTableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'

export class SelectRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement|GroupSelectStatement) {}

    single(): SelectSingleRow<T> {
        return new SelectSingleRow(this.statement)
    }

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            },
            this.client)
    }

    distinct() {
        return new LimitRows(
            {
                ...this.statement,
                distinct: true
            },
            this.client)
    }

    readonly client = 'rows'
}

export function selectTable<T>(statement: SelectStatement, constructor: Function): SelectRows<T> {
    return new SelectRows(
        {
            ...statement,
            selection: parseSingleTableSelection(constructor)
        })
}

export function mapTable<T>(statement: SelectStatement, map: Function): SelectRows<T> {
    return new SelectRows(
        {
            ...statement,
            selection: parseMapSelection(map)
        })
}

export function mapTableWithSubquery<T, S>(statement: SelectStatement, map: Function, subtable: Table<S>): SelectRows<T> {
    return new SelectRows(
        {
            ...statement,
            selection: parseMapWithSubquerySelection(map, [subtable.tableName])
        })
}

export function getColumn<T>(statement: SelectStatement, get: Function): SelectVector<T> {
    return new SelectVector(
        {
            ...statement,
            selection: parseGetSelection(get)
        })
}

export function maximizeColumn<T>(statement: SelectStatement, max: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseMaxSelection(max)
        })
}

export function minimizeColumn<T>(statement: SelectStatement, min: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseMinSelection(min)
        })
}

export function sumColumn<T>(statement: SelectStatement, sum: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseSumSelection(sum)
        })
}

export function averageColumn<T>(statement: SelectStatement, average: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseAverageSelection(average)
        })
}

export function countRows(statement: SelectStatement): SelectScalar<number> {
    return new SelectScalar(
        {
            ...statement,
            selection: createCountSelection()
        })
}

export function aggregateTables<A>(statement: SelectStatement, aggregation: Function, numberOfTables: number): SelectSingleRow<A> {
    return new SelectSingleRow({
        ...statement,
        selection: parseTableAggregationSelection(aggregation, numberOfTables)
    })
}

export function groupBy<T>(table: Table<T>, getKey: Function): GroupSelectStatement {
    return createEmptyGroupSelectStatement(table.tableName, parseGetKey(getKey))
}
