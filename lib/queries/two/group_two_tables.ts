import {GroupSelectStatement, SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/selection/aggregation_parsing'
import {AggregatableTable, Avg, Count, Max, Min, StringAggregationRecord, Sum} from '../one/aggregatable_table'
import {SelectRows} from '../selection/select_rows'
import {SortGrouping} from '../one/sort_grouping'
import {parseGroupSorting} from '../../parsing/sorting/group_sorting_parsing'
import {SortGroupingOfTwoTables} from './sort_grouping_of_two_tables'

export class GroupTwoTables<T1, T2, K extends StringValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T1>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables<T1, T2, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'asc', this.statement.key, 2))
            })
    }

    sortDescendinglyBy(sortBy: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T1>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGroupingOfTwoTables<T1, T2, K> {
        return new SortGroupingOfTwoTables<T1, T2, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'desc', this.statement.key, 2))
            })
    }

    aggregate<A extends StringAggregationRecord<K>>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key, 2)
            })
    }
}