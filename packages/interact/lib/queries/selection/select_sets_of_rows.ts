import {LimitRows} from './limit_rows'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {Table} from '../one/table'
import {parseSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {parseGroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {parseMultipleTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {SelectExpectedSingleRow} from './select_expected_single_row'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'
import {DistinctRows} from './distinct_rows'

export class SelectSetsOfRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement) {}

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            },
            this.clientInstruction)
    }

    distinct() {
        return new DistinctRows(
            {
                ...this.statement,
                distinct: true
            },
            this.clientInstruction)
    }

    readonly clientInstruction = 'sets-of-rows'
}

export function selectSetsOfRows<Ts>(
    statement: SelectStatement,
    nameAndConstructorPairs: [string, Function][]): SelectSetsOfRows<Ts> {

    return new SelectSetsOfRows(
        {
            ...statement,
            selection: parseMultipleTableSelection(nameAndConstructorPairs)
        })
}
