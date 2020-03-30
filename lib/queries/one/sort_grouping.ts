import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {GroupSelectStatement} from '../../select_statement'
import {AggregatableTable, Avg, Count, Max, Min, StringAggregationRecord, Sum} from './aggregatable_table'
import {parseGroupSorting} from '../../parsing/sorting/group_sorting_parsing'
import {SelectRows} from '../selection/select_rows'
import {parseAggregationSelection} from '../../parsing/selection/aggregation_selection_parsing'

export class SortGrouping<T, K extends StringValueRecord> {
    constructor(private readonly statement: GroupSelectStatement) {}

    thenBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K | Max | Min | Avg | Sum | Count): SortGrouping<T, K> {
        return new SortGrouping<T, K>(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseGroupSorting(sortBy, 'asc', this.statement.key, 1))
            })
    }

    thenDescendinglyBy(sortBy: (key: K, table: AggregatableTable<T>, count: () => Count) => K | Max | Min | Avg | Sum | Count): SortGrouping<T, K> {
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