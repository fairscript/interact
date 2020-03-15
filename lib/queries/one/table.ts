import {Constructor, SelectStatement} from '../../select_statement'
import {FilterTable} from './filter_table'
import {SortTable} from './sort_table'
import {TableSelection} from '../selections/table_selection'
import {GroupTable} from './group_table'
import {JoinSecondTable} from '../two/join_second_table'
import {ColumnSelection} from '../selections/column_selection'
import {EnforceNonEmptyRecord, StringValueOrColumnSelectionRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseOrder} from '../../parsing/order_parsing'
import {parseSingleTableSelect} from '../../parsing/select_parsing'
import {parsePredicate} from '../../parsing/predicate_parsing'
import {parseGet} from '../../generation/get_parsing'
import {parseMap} from '../../parsing/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseJoin} from '../../parsing/join_parsing'
import {createCount} from '../../column_operations'


export class Table<T> {
    private readonly statement: SelectStatement

    constructor(
        protected constructor: Constructor<T>,
        protected tableName: string) {

        this.statement = {
            tableName,
            selection: [],
            predicates: [],
            orders: [],
            joins: [],
            key: null
        }
    }

    filter(predicate: (table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            {
                ...this.statement,
                predicates: this.statement.predicates.concat(parsePredicate(predicate))
            }
        )
    }

    sortBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select(): TableSelection {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseSingleTableSelect(this.constructor)
            })
    }

    get<U extends Value>(f: (table: T) => U): ColumnSelection {
        return new ColumnSelection(
            {
                ...this.statement,
                selection: [parseGet(f)]
            })
    }

    count(): ColumnSelection {
        return new ColumnSelection(
            {
                ...this.statement,
                selection: [createCount()]
            })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): TableSelection {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    mapS<S, U extends StringValueOrColumnSelectionRecord>(tableInSubquery: Table<S>, f: (s: Table<S>, x: T) => U): TableSelection {
        throw Error('Not implemented')
    }

    groupBy<K extends StringValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable<T, K>(
            {
                ...this.statement,
                key: parseGetKey(getKey)
            })
    }

    join<U, K extends Value>(otherTable: Table<U>, left: (firstTable: T) => K, right: (secondTable: U) => K) {
        return new JoinSecondTable<T, U, K>(
            this.constructor,
            otherTable.constructor,
            {
                ...this.statement,
                joins: this.statement.joins.concat([parseJoin(otherTable.tableName, left, right)])
            })
    }
}

export function defineTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table<T>(constructor, name)
}