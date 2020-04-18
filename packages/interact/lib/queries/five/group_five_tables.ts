import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {AggregatableTable} from '../aggregatable_table'
import {aggregateGroups, SelectRows} from '../selection/select_rows'
import {SortGroupingOfFiveTables} from './sort_grouping_of_five_tables'
import {
    addAscendingGroupOrder,
    addDescendingGroupOrder,
    GroupSelectStatement
} from '../../statements/group_select_statement'
import {Value} from '../../value'

export class GroupFiveTables<T1, T2, T3, T4, T5, K extends ValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>, count: () => number) => Value): SortGroupingOfFiveTables<T1, T2, T3, T4, T5, K> {
        return new SortGroupingOfFiveTables(addAscendingGroupOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>, count: () => number) => Value): SortGroupingOfFiveTables<T1, T2, T3, T4, T5, K> {
        return new SortGroupingOfFiveTables(addDescendingGroupOrder(this.statement, sortBy))
    }

    aggregate<A extends ValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return aggregateGroups(this.statement, aggregation)
    }
}