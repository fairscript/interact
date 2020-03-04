import {SelectTable} from './selection'
import {MapTable} from './mapping'
import {joinWithNewLine} from '../parsing/parsing'
import {generateSortBy} from '../parsing/sort_by'
import {Constructor} from '../table'

export type By<T> = (x: T) => number | string
export type Order<T> = {
    by: By<T>
    direction: 'asc' | 'desc'
}

export class SortTable<T> {
    constructor(
        private readonly generateTableSql: () => string,
        private readonly ctor: Constructor<T>,
        private readonly orders: Array<Order<T>>) {
    }

    thenBy(by: By<T>): SortTable<T> {
        return new SortTable(this.generateTableSql, this.ctor, this.orders.concat({by, direction: 'asc'}))
    }

    thenDescendinglyBy(by: By<T>): SortTable<T> {
        return new SortTable(this.generateTableSql, this.ctor, this.orders.concat({by, direction: 'desc'}))
    }

    select(): SelectTable<T> {
        return new SelectTable(() => this.toString(), this.ctor)
    }

    map<U>(f: (x: T) => U): MapTable<T, U> {
        return new MapTable(() => this.toString(), f)
    }

    toString(): string {
        return joinWithNewLine([
            this.generateTableSql(),
            generateSortBy(this.orders)
        ])
    }
}