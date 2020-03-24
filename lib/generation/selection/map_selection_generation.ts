import {MapSelection} from '../../parsing/selection/map_parsing'
import {GetColumn, Subselect} from '../../column_operations'
import {generateGetColumn} from '../get_column_generation'
import {generateSubselect} from '../subselect_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'

function generateMapPropertyOperation(parameterToTable: { [parameter: string]: string }, operation: GetColumn | Subselect): string {
    switch (operation.kind) {
        case 'get-column':
            return generateGetColumn(parameterToTable, operation)
        case 'subselect':
            return generateSubselect(operation)
    }
}

export function generateMapSelection(selection: MapSelection): string {
    const {parameterToTable, operations} = selection

    return joinWithCommaWhitespace(operations.map(([alias, operation]) => {
        return `${generateMapPropertyOperation(parameterToTable, operation)} AS ${alias}`
    }))
}
