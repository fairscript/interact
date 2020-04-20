import {AggregateColumn} from '../parsing/aggregation/aggregate_column_parsing'
import {collectColumnTypeRecords, ColumnTypeRecord} from '../record'
import {determineOperationColumnTypeMapping} from './result_columns'
import {CountSelection} from '../parsing/selection/count_selection'
import {SingleColumnSelection} from '../parsing/selection/single_column_selection_parsing'
import {SubselectStatement} from '../statements/subselect_statement'
import {MapSelection} from '../parsing/selection/map_selection_parsing'
import {TableAggregationSelection} from '../parsing/selection/table_aggregation_selection_parsing'
import {GroupAggregationSelection} from '../parsing/selection/group_aggregation_selection_parsing'
import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'
import {SelectStatementAdaptationRule} from './dialects'

type AdaptAggregateColumn = (aggregateColumn: AggregateColumn) => AggregateColumn

function applyRuleToAggregateColumn(
    adaptAggregateColumn: AdaptAggregateColumn,
    columnRecords: ColumnTypeRecord[],
    parameterNameToTableAlias: { [p: string]: string },
    op: AggregateColumn): AggregateColumn {
    const {aggregated} = op

    if (aggregated.kind === 'get-column') {
        const [columnType, _] = determineOperationColumnTypeMapping(columnRecords, parameterNameToTableAlias, aggregated, null)

        if (columnType === 'boolean') {
            return adaptAggregateColumn(op)
        }

        return op
    }

    return op
}

function applyRuleToSubselection(
    adaptAggregateColumn: AdaptAggregateColumn,
    subselection: CountSelection|SingleColumnSelection,
    columns: ColumnTypeRecord): CountSelection|SingleColumnSelection {

    switch (subselection.kind) {
        case 'count-selection':
            return subselection
        case 'single-column-selection':
            return applyRuleToSingleColumnSelection(adaptAggregateColumn, subselection, [columns])
    }
}

function applyRuleToSubselectStatement(adaptAggregateColumn: AdaptAggregateColumn, statement: SubselectStatement): SubselectStatement {
    return {
        ...statement,
        selection: applyRuleToSubselection(adaptAggregateColumn, statement.selection, statement.columns)
    }
}

function applyRuleToSingleColumnSelection(
    adaptAggregateColumn: AdaptAggregateColumn,
    selection: SingleColumnSelection,
    columnRecords: ColumnTypeRecord[]): SingleColumnSelection {

    const {operation, parameterNameToTableAlias} = selection
    if (operation.kind === 'aggregate-column') {
        return {
            ...selection,
            operation: applyRuleToAggregateColumn(adaptAggregateColumn, columnRecords, parameterNameToTableAlias, operation)
        }
    }
    else {
        return selection
    }
}

function applyRuleToMapSelection(adaptAggregateColumn: AdaptAggregateColumn, selection: MapSelection): MapSelection {
    return {
        ...selection,
        operations: selection.operations.map(([alias, op]) => {
            switch (op.kind) {
                case 'get-column':
                    return [alias, op]
                case 'subselect-statement':
                    return [alias, applyRuleToSubselectStatement(adaptAggregateColumn, op)]
            }
        })
    }
}

function applyRuleToTableAggregationSelection(
    adaptAggregateColumn: AdaptAggregateColumn,
    selection: TableAggregationSelection,
    columnRecords: ColumnTypeRecord[]): TableAggregationSelection {

    return {
        ...selection,
        operations: selection.operations.map(([alias, op]) => {
            if (op.kind === 'aggregate-column') {
                return [alias, applyRuleToAggregateColumn(adaptAggregateColumn, columnRecords, selection.parameterToTable, op)]
            }
            else {
                return [alias, op]
            }
        })
    }
}

function applyRuleToGroupAggregationSelection(
    adaptAggregateColumn: AdaptAggregateColumn,
    selection: GroupAggregationSelection,
    columnRecords: ColumnTypeRecord[]): GroupAggregationSelection {
    return {
        ...selection,
        operations: selection.operations.map(([alias, op]) => {
            switch (op.kind) {
                case 'count-operation':
                case 'get-part-of-key':
                    return [alias, op]
                case 'aggregate-column':
                    return [alias, applyRuleToAggregateColumn(adaptAggregateColumn, columnRecords, selection.parameterToTable, op)]
                case 'subselect-statement':
                    return [alias, applyRuleToSubselectStatement(adaptAggregateColumn, op)]
            }
        })
    }
}


export function createBooleanColumnAggregationAdaptationRule(adaptAggregateColumn: AdaptAggregateColumn): SelectStatementAdaptationRule  {

    function rule(statement: SelectStatement|GroupSelectStatement): SelectStatement | GroupSelectStatement {
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
                    selection: applyRuleToMapSelection(adaptAggregateColumn, selection)
                } as SelectStatement
            case 'single-column-selection':
                return {
                    ...statement,
                    selection: applyRuleToSingleColumnSelection(adaptAggregateColumn, selection, collectColumnTypeRecords(statement))
                } as SelectStatement
            case 'table-aggregation-selection':
                return {
                    ...statement,
                    selection: applyRuleToTableAggregationSelection(adaptAggregateColumn, selection, collectColumnTypeRecords(statement))
                } as SelectStatement
            case 'group-aggregation-selection':
                return {
                    ...statement,
                    selection: applyRuleToGroupAggregationSelection(adaptAggregateColumn, selection, collectColumnTypeRecords(statement))
                } as GroupSelectStatement
        }
    }

    return rule
}
