import {MapSelection} from '../../parsing/selection/map_parsing'
import {GetFromParameter, Subselect} from '../../column_operations'
import {generateGetFromParameter} from '../get_from_parameter_generation'
import {generateSubselect} from '../subselect_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'

function generateColumnOperation(parameterToTable: { [parameter: string]: string }, operation: GetFromParameter | Subselect): string {
    switch (operation.kind) {
        case 'get-from-parameter':
            return generateGetFromParameter(parameterToTable, operation)
        case 'subselect':
            return generateSubselect(operation)
    }
}

export function generateMapSelection(selection: MapSelection): string {
    const {parameterToTable, operations} = selection

    return joinWithCommaWhitespace(operations.map(([alias, operation]) => {
        return `${generateColumnOperation(parameterToTable, operation)} AS ${alias}`
    }))
}
