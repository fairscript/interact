import * as toSnakeCase from 'js-snakecase'

import {joinWithCommaWhitespace} from '../../parsing/javascript_parsing'
import {SingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'

export function generateSingleTableSelection(selection: SingleTableSelection): string {
    return joinWithCommaWhitespace(selection.properties.map(toSnakeCase).map(column => `t1.${column}`))
}

