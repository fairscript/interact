import {Constructor, createGroupSelectStatement, SelectStatement} from '../../select_statement'
import {SortTwoTables} from './sort_two_tables'
import {FilterTwoTables} from './filter_two_tables'
import {GroupTwoTables} from './group_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord, ValueOrNestedStringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseSorting} from '../../parsing/sorting/sorting_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseMultipleTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {Subtable} from '../one/subtable'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {Table} from '../one/table'
import {createCountSelection} from '../../parsing/selection/count_selection'
import {parseParameterlessFilter} from '../../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../../parsing/filtering/parameterized_filter_parsing'
import {SelectScalar} from '../selection/select_scalar'
import {SelectRows} from '../selection/select_rows'
import {SelectVector} from '../selection/select_vector'

export class JoinSecondTable<T1, T2> {

    constructor(
        private readonly firstConstructor: Constructor<T1>,
        private readonly secondConstructor: Constructor<T2>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {
        return new FilterTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterlessFilter(predicate))
            },
            1)
    }

    filterP<P extends ValueOrNestedStringValueRecord>(provided: P, predicate: (parameter: P, first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {
        return new FilterTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterizedFilter(predicate, `f1`, provided))
            },
            1)
    }

    sortBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'desc'))
            })
    }

    select<K extends string>(first: string, second: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMultipleTableSelection([
                    [first, this.firstConstructor],
                    [second, this.secondConstructor]
                ])
            })
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapSelection(f)
            })
    }

    mapS<S, U extends StringValueRecord>(
        tableInSubquery: Table<S>,
        f: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapWithSubquerySelection(f, [tableInSubquery.tableName])
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): SelectVector<U> {
        return new SelectVector(
            {
                ...this.statement,
                selection: parseGetSelection(f)
            })
    }


    count(): SelectScalar<number> {
        return new SelectScalar<number>(
            {
                ...this.statement,
                selection: createCountSelection()
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(
            createGroupSelectStatement(this.statement, parseGetKey(getKey))
        )
    }
}

