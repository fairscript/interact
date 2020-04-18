import {SelectStatement} from '@fairscript/interact/lib/statements/select_statement'
import {GroupSelectStatement} from '@fairscript/interact/lib/statements/group_select_statement'
import {SingleColumnSelection} from '@fairscript/interact/lib/parsing/selection/single_column_selection_parsing'
import {MapSelection} from '@fairscript/interact/lib/parsing/selection/map_selection_parsing'
import {TableAggregationSelection} from '@fairscript/interact/lib/parsing/selection/table_aggregation_selection_parsing'
import {GroupAggregationSelection} from '@fairscript/interact/lib/parsing/selection/group_aggregation_selection_parsing'
import {
    AggregateColumn,
    createAggregateColumn
} from '@fairscript/interact/lib/parsing/aggregation/aggregate_column_parsing'
import {SubselectStatement} from '@fairscript/interact/lib/statements/subselect_statement'
import {CountSelection} from '@fairscript/interact/lib/parsing/selection/count_selection'
import {collectColumnTypeRecords, ColumnTypeRecord} from '@fairscript/interact/lib/record'
import {createImplicitlyConvertBooleanToInteger} from '@fairscript/interact/lib/parsing/conversions'
import {determineOperationColumnTypeMapping} from '@fairscript/interact/lib/databases/result_columns'

function applyRuleToAggregateColumn(columnRecords: ColumnTypeRecord[], parameterNameToTableAlias: { [p: string]: string }, op: AggregateColumn): AggregateColumn {
    const {aggregated} = op

    switch (aggregated.kind) {
        case 'get-column':
            const [columnType, _] = determineOperationColumnTypeMapping(columnRecords, parameterNameToTableAlias, aggregated, null)

            if (columnType === 'boolean') {
                const implicitlyConvert = createImplicitlyConvertBooleanToInteger(aggregated)
                return createAggregateColumn(op.aggregationFunction, implicitlyConvert)
            }
            else {
                return op
            }
        case 'implicitly-convert-boolean-to-integer':
            return op
    }
}

function applyRuleToSubselection(subselection: CountSelection|SingleColumnSelection, columns: ColumnTypeRecord): CountSelection|SingleColumnSelection {
    switch (subselection.kind) {
        case 'count-selection':
            return subselection
        case 'single-column-selection':
            return applyRuleToSingleColumnSelection(subselection, [columns])
    }
}

function applyRuleToSubselectStatement(statement: SubselectStatement): SubselectStatement {
    return {
        ...statement,
        selection: applyRuleToSubselection(statement.selection, statement.columns)
    }
}

function applyRuleToSingleColumnSelection(selection: SingleColumnSelection, columnRecords: ColumnTypeRecord[]): SingleColumnSelection {
    const {operation, parameterNameToTableAlias} = selection
    if (operation.kind === 'aggregate-column') {
        return {
            ...selection,
            operation: applyRuleToAggregateColumn(columnRecords, parameterNameToTableAlias, operation)
        }
    }
    else {
        return selection
    }
}

function applyRuleToMapSelection(selection: MapSelection): MapSelection {
    return {
        ...selection,
        operations: selection.operations.map(([alias, op]) => {
            switch (op.kind) {
                case 'get-column':
                    return [alias, op]
                case 'subselect-statement':
                    return [alias, applyRuleToSubselectStatement(op)]
            }
        })
    }
}

function applyRuleToTableAggregationSelection(selection: TableAggregationSelection, columnRecords: ColumnTypeRecord[]): TableAggregationSelection {
    return {
        ...selection,
        operations: selection.operations.map(([alias, op]) => {
            switch (op.kind) {
                case 'count-operation':
                    return [alias, op]
                case 'aggregate-column':
                    return [alias, applyRuleToAggregateColumn(columnRecords, selection.parameterToTable, op)]
            }
        })
    }
}

function applyRuleToGroupAggregationSelection(selection: GroupAggregationSelection, columnRecords: ColumnTypeRecord[]): GroupAggregationSelection {
    return {
        ...selection,
        operations: selection.operations.map(([alias, op]) => {
            switch (op.kind) {
                case 'count-operation':
                case 'get-part-of-key':
                    return [alias, op]
                case 'aggregate-column':
                    return [alias, applyRuleToAggregateColumn(columnRecords, selection.parameterToTable, op)]
                case 'subselect-statement':
                    return [alias, applyRuleToSubselectStatement(op)]
            }
        })
    }
}


export function convertAggregatedBooleanColumnToIntegerRule(statement: (SelectStatement | GroupSelectStatement)): SelectStatement|GroupSelectStatement {
    const selection = statement.selection!

    switch (selection.kind) {
        case 'count-selection':
        case 'single-table-selection':
        case 'multi-table-selection':
        case 'single-group-aggregation-operation-selection':
            return statement
        case 'map-selection':
            return {
                ...statement,
                selection: applyRuleToMapSelection(selection)
            } as SelectStatement
        case 'single-column-selection':
            return {
                ...statement,
                selection: applyRuleToSingleColumnSelection(selection, collectColumnTypeRecords(statement))
            } as SelectStatement
        case 'table-aggregation-selection':
            return {
                ...statement,
                selection: applyRuleToTableAggregationSelection(selection, collectColumnTypeRecords(statement))
            } as SelectStatement
        case 'group-aggregation-selection':
            return {
                ...statement,
                selection: applyRuleToGroupAggregationSelection(selection, collectColumnTypeRecords(statement))
            } as GroupSelectStatement
    }
}
