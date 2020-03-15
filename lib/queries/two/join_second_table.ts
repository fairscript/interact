import {Constructor, SelectStatement} from '../../select_statement'
import {parseJoin} from '../../parsing/join_parsing'
import {MapTwoTables} from './map_two_tables'
import {SelectTwoTables} from './select_two_tables'
import {SortTwoTables} from './sort_two_tables'
import {FilterTwoTables} from './filter_two_tables'
import {GroupTwoTables} from './group_two_tables'
import {GetColumnFromTwoTables} from './get_column_from_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseGet} from '../../generation/get_parsing'
import {parseMap} from '../../parsing/map_parsing'
import {parseMultiTableSelect} from '../../parsing/select_parsing'
import {parseOrder} from '../../parsing/order_parsing'
import {parsePredicate} from '../../parsing/predicate_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'

export class JoinSecondTable<T1, T2, K1> {

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
                predicates: this.statement.predicates.concat(parsePredicate(predicate))
            })
    }

    sortBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select(first: string, second: string): SelectTwoTables {
        return new SelectTwoTables(
            {
                ...this.statement,
                selection: parseMultiTableSelect({
                    [first]: this.firstConstructor,
                    [second]: this.secondConstructor
                })
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): GetColumnFromTwoTables {
        return new GetColumnFromTwoTables(
            {
                ...this.statement,
                selection: [parseGet(f)]
            })
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): MapTwoTables {
        return new MapTwoTables(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(
            {
                ...this.statement,
                key: parseGetKey(getKey)
            })
    }
}

