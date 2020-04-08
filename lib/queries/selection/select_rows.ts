import {SelectSingleRow} from './select_single_row'
import {LimitRows} from './limit_rows'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {Table} from '../one/table'
import {parseSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {parseGroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'

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

export function aggregateGroups<T>(statement: GroupSelectStatement, aggregation: Function): SelectRows<T> {
    return new SelectRows(
        {
            ...statement,
            selection: parseGroupAggregationSelection(aggregation, statement.key, statement.join === null ? 1 : 2)
        })
}