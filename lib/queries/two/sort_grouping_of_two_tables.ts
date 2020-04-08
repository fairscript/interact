import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {parseGroupSorting} from '../../parsing/sorting/group_sorting_parsing'
import {SelectRows} from '../selection/select_rows'
import {parseGroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {AggregatableTable, Avg, Count, Max, Min, GroupAggregationRecord, Sum} from '../one/aggregatable_table'
import {GroupSelectStatement} from '../../statements/group_select_statement'

export class SortGroupingOfTwoTables<T1, T2, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => Count) => K | Max | Min | Avg | Sum | Count): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables<T1, T2, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'asc', this.statement.key, 2))
            })
    }

    thenDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => Count) => K | Max | Min | Avg | Sum | Count): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables<T1, T2, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'desc', this.statement.key, 2))
            })
    }

    aggregate<A extends GroupAggregationRecord<K>>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {

        return new SelectRows(
            {
                ...this.statement,
                selection: parseGroupAggregationSelection(aggregation, this.statement.key, 2)
            })
    }
}