import {GetSelection} from './selection/get_parsing'
import {MapSelection} from './selection/map_parsing'
import {Aggregation} from './selection/aggregation_parsing'
import {CountSelection} from './selection/count_parsing'
import {SingleTableSelection} from './selection/single_table_selection_parsing'
import {MultiTableSelection} from './selection/multi_table_selection_parsing'

export type Selection = Aggregation|CountSelection|GetSelection|MapSelection|MultiTableSelection|SingleTableSelection