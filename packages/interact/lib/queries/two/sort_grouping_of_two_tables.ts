import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {AggregatableTable} from '../aggregatable_table'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class SortGroupingOfTwoTables<T1, T2, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => number) => Value): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    thenDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => number) => Value): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}