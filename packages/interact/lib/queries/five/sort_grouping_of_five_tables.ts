import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {AggregatableTable} from '../aggregatable_table'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class SortGroupingOfFiveTables<T1, T2, T3, T4, T5, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>, count: () => number) => Value): SortGroupingOfFiveTables<T1, T2, T3, T4, T5, K> {
        return new SortGroupingOfFiveTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    thenDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>, count: () => number) => Value): SortGroupingOfFiveTables<T1, T2, T3, T4, T5, K> {
        return new SortGroupingOfFiveTables(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}