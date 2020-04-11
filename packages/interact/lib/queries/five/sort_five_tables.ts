import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {Table} from '../one/table'
import {Subtable} from '../subtable'
import {mapTable, mapTableWithSubquery, SelectRows, selectTables} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {addAscendingOrder, addDescendingOrder, Constructor, SelectStatement} from '../../statements/select_statement'

export class SortFiveTables<T1, T2, T3, T4, T5> {

    constructor(
        private firstConstructor: Constructor<T1>,
        private secondConstructor: Constructor<T2>,
        private thirdConstructor: Constructor<T3>,
        private fourthConstructor: Constructor<T4>,
        private fifthConstructor: Constructor<T5>,
        private readonly statement: SelectStatement) {}

    thenBy(sortBy: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => Value): SortFiveTables<T1, T2, T3, T4, T5> {
        return new SortFiveTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            this.fourthConstructor,
            this.fifthConstructor,
            addAscendingOrder(this.statement, sortBy))
    }

    thenDescendinglyBy(sortBy: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => Value): SortFiveTables<T1, T2, T3, T4, T5> {
        return new SortFiveTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            this.fourthConstructor,
            this.fifthConstructor,
            addDescendingOrder(this.statement, sortBy))
    }

    select<K extends string>(firstName: string, secondName: string, thirdName: string, fourthName: string, fifthName: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 } & { [third in K]: T3 } & { [fourth in K]: T4 } & { [fifth in K]: T5 }> {
        return selectTables(
            this.statement,
            [
                [firstName, this.firstConstructor],
                [secondName, this.secondConstructor],
                [thirdName, this.thirdConstructor],
                [fourthName, this.fourthConstructor],
                [fifthName, this.fifthConstructor]
            ])
    }

    map<U extends ValueRecord>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        return typeof fOrTableInSubquery === 'function'
            ? mapTable(this.statement, fOrTableInSubquery)
            : mapTableWithSubquery(this.statement, f!, fOrTableInSubquery)
    }

    get<U extends Value>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => U): SelectVector<U> {
        return getColumn(this.statement, f)
    }

}