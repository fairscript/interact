import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {SortGroupingOfTwoTables} from './sort_grouping_of_two_tables'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class GroupTwoTables<T1, T2, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => number) => Value): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, count: () => number) => Value): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}