import {LimitRows} from './limit_rows'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {Table} from '../one/table'
import {parseGroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {SelectExpectedSingleRow} from './select_expected_single_row'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'
import {DistinctRows} from './distinct_rows'
import {createSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'

export class SelectRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement|GroupSelectStatement) {}

    single(): SelectExpectedSingleRow<T> {
        return new SelectExpectedSingleRow(this.statement)
    }

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            },
            this.clientInstruction)
    }

    distinct() {
        return new DistinctRows(
            {
                ...this.statement,
                distinct: true
            },
            this.clientInstruction)
    }

    readonly clientInstruction = 'rows'
}

export function selectTable<T>(statement: SelectStatement): SelectRows<T> {
    return new SelectRows(
        {
            ...statement,
            selection: createSingleTableSelection()
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
            selection: parseMapWithSubquerySelection(subtable.tableName, subtable.columns, map)
        })
}

export function aggregateGroups<T>(statement: GroupSelectStatement, aggregation: Function): SelectRows<T> {
    return new SelectRows(
        {
            ...statement,
            selection: parseGroupAggregationSelection(aggregation, statement.key, statement.joins.length+1)
        })
}