import {MapSelection} from './map_selection_parsing'
import {GroupAggregationSelection} from './group_aggregation_selection_parsing'
import {CountSelection} from './count_selection'
import {SingleTableSelection} from './single_table_selection_parsing'
import {MultiTableSelection} from './multi_table_selection_parsing'
import {SingleColumnSelection} from './single_column_selection_parsing'
import {TableAggregationSelection} from './table_aggregation_selection_parsing'
import {SingleGroupAggregationOperationSelection} from './single_group_aggregation_operation_selection'

export type GroupSelection = GroupAggregationSelection|SingleGroupAggregationOperationSelection
export type TableSelection = CountSelection|SingleColumnSelection|MapSelection|SingleTableSelection|MultiTableSelection|TableAggregationSelection