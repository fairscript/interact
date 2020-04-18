import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {AggregatableTable} from '../aggregatable_table'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class SortGroupingOfFourTables<T1, T2, T3, T4, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, count: () => number) => Value): SortGroupingOfFourTables<T1, T2, T3, T4, K> {
        return new SortGroupingOfFourTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    thenDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, count: () => number) => Value): SortGroupingOfFourTables<T1, T2, T3, T4, K> {
        return new SortGroupingOfFourTables(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}