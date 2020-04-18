import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class SortGrouping<T, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => number) => Value): SortGrouping<T, K> {
        return new SortGrouping(addAscendingGroupOrder(this.statement, sortBy))
    }

    thenDescendinglyBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => number) => Value): SortGrouping<T, K> {
        return new SortGrouping(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, table: AggregatableTable<T>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}