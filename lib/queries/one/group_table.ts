import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable, Avg, Count, GroupAggregationRecord, Max, Min, Sum} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {SortGrouping} from './sort_grouping'
import {
    addAscendingGroupOrder,
    addDescendinGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'


export class GroupTable<T, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGrouping<T, K> {
        return new SortGrouping(addAscendingGroupOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGrouping<T, K> {
        return new SortGrouping(addDescendinGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends GroupAggregationRecord<K>>(
        aggregation: (key: K, table: AggregatableTable<T>, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}

