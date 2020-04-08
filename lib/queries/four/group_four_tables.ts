import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable, Avg, Count, GroupAggregationRecord, Max, Min, Sum} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {SortGroupingOfFourTables} from './sort_grouping_of_four_tables'
import {
    addAscendingGroupOrder,
    addDescendinGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'

export class GroupFourTables<T1, T2, T3, T4, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfFourTables<T1, T2, T3, T4, K> {
        return new SortGroupingOfFourTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfFourTables<T1, T2, T3, T4, K> {
        return new SortGroupingOfFourTables(addDescendinGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends GroupAggregationRecord<K>>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}