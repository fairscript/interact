import {GroupSelectStatement, SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {parseGroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {AggregatableTable, Avg, Count, Max, Min, GroupAggregationRecord, Sum} from './aggregatable_table'
import {SelectRows} from '../selection/select_rows'
import {SortGrouping} from './sort_grouping'
import {parseGroupSorting} from '../../parsing/sorting/group_sorting_parsing'


export class GroupTable<T, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGrouping<T, K> {
        return new SortGrouping<T, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'asc', this.statement.key, 1))
            })
    }

    sortDescendinglyBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGrouping<T, K> {
        return new SortGrouping<T, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'desc', this.statement.key, 1))
            })
    }

    aggregate<A extends GroupAggregationRecord<K>>(
        aggregation: (key: K, table: AggregatableTable<T>, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {

        return new SelectRows(
            {
                ...this.statement,
                selection: parseGroupAggregationSelection(aggregation, this.statement.key, 1)
            })
    }
}

