import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable, Avg, Count, GroupAggregationRecord, Max, Min, Sum} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {SortGroupingOfTwoTables} from './sort_grouping_of_two_tables'
import {
    addAscendingGroupOrder,
    addDescendinGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'

export class GroupTwoTables<T1, T2, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables(addDescendinGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends GroupAggregationRecord<K>>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}