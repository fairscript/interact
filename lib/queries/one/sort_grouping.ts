import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable, Avg, Count, Max, Min, GroupAggregationRecord, Sum} from './aggregatable_table'
import {parseGroupSorting} from '../../parsing/sorting/group_sorting_parsing'
import {SelectRows} from '../selection/select_rows'
import {parseGroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {GroupSelectStatement} from '../../statements/group_select_statement'

export class SortGrouping<T, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K | Max | Min | Avg | Sum | Count): SortGrouping<T, K> {
        return new SortGrouping<T, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'asc', this.statement.key, 1))
            })
    }

    thenDescendinglyBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K | Max | Min | Avg | Sum | Count): SortGrouping<T, K> {
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