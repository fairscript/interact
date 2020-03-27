import {SingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'

export function generateSingleTableSelection(aliasEscape: string|null, selection: SingleTableSelection): string {
    return joinWithCommaWhitespace(
        selection.properties.map(property =>
            generateAlias(aliasEscape, generateColumnAccess('t1', property), property)
        )
    )
}

