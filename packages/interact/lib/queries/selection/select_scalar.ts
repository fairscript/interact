import {
    parseAverageSelection,
    parseMaxSelection,
    parseMinSelection,
    parseSumSelection
} from '../../parsing/selection/aggregate_column_select_parsing'
import {createCountSelection} from '../../parsing/selection/count_selection'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'

export class SelectScalar<T> implements Runnable<T> {
    constructor(public statement: SelectStatement) {}

    readonly clientInstruction = 'scalar'
}

export function maximizeColumn<T>(statement: SelectStatement, max: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseMaxSelection(max)
        })
}

export function minimizeColumn<T>(statement: SelectStatement, min: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseMinSelection(min)
        })
}

export function sumColumn<T>(statement: SelectStatement, sum: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseSumSelection(sum)
        })
}

export function averageColumn<T>(statement: SelectStatement, average: Function): SelectScalar<T> {
    return new SelectScalar(
        {
            ...statement,
            selection: parseAverageSelection(average)
        })
}

export function countRows(statement: SelectStatement): SelectScalar<number> {
    return new SelectScalar(
        {
            ...statement,
            selection: createCountSelection()
        })
}