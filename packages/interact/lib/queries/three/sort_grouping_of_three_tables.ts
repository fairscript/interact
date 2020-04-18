import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {AggregatableTable} from '../aggregatable_table'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class SortGroupingOfThreeTables<T1, T2, T3, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => number) => Value): SortGroupingOfThreeTables<T1, T2, T3, K> {
        return new SortGroupingOfThreeTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    thenDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => number) => Value): SortGroupingOfThreeTables<T1, T2, T3, K> {
        return new SortGroupingOfThreeTables(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}