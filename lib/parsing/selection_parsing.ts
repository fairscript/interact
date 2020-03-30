import {MapSelection} from './selection/map_selection_parsing'
import {Aggregation} from './selection/aggregation_selection_parsing'
import {CountSelection} from './selection/count_selection'
import {SingleTableSelection} from './selection/single_table_selection_parsing'
import {MultiTableSelection} from './selection/multi_table_selection_parsing'
import {SingleColumnSelection} from './selection/single_column_selection_parsing'

export type Selection = Aggregation|CountSelection|SingleColumnSelection|MapSelection|MultiTableSelection|SingleTableSelection