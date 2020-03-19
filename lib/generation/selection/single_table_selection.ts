import * as toSnakeCase from 'js-snakecase'

import {SingleTableSelection} from '../../parsing/select_parsing'
import {joinWithCommaWhitespace} from '../../parsing/javascript_parsing'

export function generateSingleTableSelection(selection: SingleTableSelection): string {
    return joinWithCommaWhitespace(selection.properties.map(toSnakeCase).map(column => `t1.${column}`))
}

