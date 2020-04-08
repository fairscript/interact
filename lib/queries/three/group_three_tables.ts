import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable, Avg, Count, GroupAggregationRecord, Max, Min, Sum} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {SortGroupingOfThreeTables} from './sort_grouping_of_three_tables'
import {
    addAscendingGroupOrder,
    addDescendinGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'

export class GroupThreeTables<T1, T2, T3, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfThreeTables<T1, T2, T3, K> {
        return new SortGroupingOfThreeTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfThreeTables<T1, T2, T3, K> {
        return new SortGroupingOfThreeTables(addDescendinGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends GroupAggregationRecord<K>>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}