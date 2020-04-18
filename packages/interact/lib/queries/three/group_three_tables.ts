import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {SortGroupingOfThreeTables} from './sort_grouping_of_three_tables'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class GroupThreeTables<T1, T2, T3, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => number) => Value): SortGroupingOfThreeTables<T1, T2, T3, K> {
        return new SortGroupingOfThreeTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, count: () => number) => Value): SortGroupingOfThreeTables<T1, T2, T3, K> {
        return new SortGroupingOfThreeTables(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}