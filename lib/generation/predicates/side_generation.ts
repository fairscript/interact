import {generateGetColumn} from '../get_column_generation'
import {generateGetProvided} from '../get_provided_generation'
import {Constant} from '../../parsing/predicates/side_parsing'
import {Side} from '../../parsing/predicates/comparisons'

function generateConstant({value}: Constant): string {
    if (typeof value === 'string') {
        return "'" + value + "'"
    }
    else {
        return value.toString()
    }
}

export function generateSide(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, side: Side): string {
    switch (side.kind) {
        case 'null':
            return 'NULL'
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, side)
        case 'constant':
            return generateConstant(side)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, side)
    }
}
