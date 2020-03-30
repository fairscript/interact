import {GroupSelectStatement, SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregationSelection} from '../../parsing/selection/aggregation_selection_parsing'
import {AggregatableTable, Avg, Count, Max, Min, StringAggregationRecord, Sum} from './aggregatable_table'
import {SelectRows} from '../selection/select_rows'
import {SortGrouping} from './sort_grouping'
import {parseGroupSorting} from '../../parsing/sorting/group_sorting_parsing'


export class GroupTable<T, K extends StringValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    sortBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGrouping<T, K> {
        return new SortGrouping<T, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'asc', this.statement.key, 1))
            })
    }

    sortDescendinglyBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K|Max|Min|Avg|Sum|Count): SortGrouping<T, K> {
        return new SortGrouping<T, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'desc', this.statement.key, 1))
            })
    }

    aggregate<A extends StringAggregationRecord<K>>(
        aggregation: (key: K, table: AggregatableTable<T>, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {

        return new SelectRows(
            {
                ...this.statement,
                selection: parseAggregationSelection(aggregation, this.statement.key, 1)
            })
    }
}

