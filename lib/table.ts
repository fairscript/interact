import {generateSelect} from './select'
import {generateFrom} from './from'
import {joinNonNullWithNewLine, joinWithNewLine} from './parsing'
import {generateMap} from './map'
import {generateFilter} from './filter'
import {generateSortBy} from './sort_by'

export interface Constructor<T> {
    new (...args: any[]): T
}

class SelectTable<T> {
    constructor(
        private readonly generateTableSql: () => string,
        private readonly ctor: Constructor<T>) {}

    toString(): string {
        return joinWithNewLine([
            generateSelect(this.ctor),
            this.generateTableSql()
        ])
    }
}

class MapTable<T, U> {
    constructor(
        private readonly generateTableSql: () => string,
        private readonly map: (x: T) => U) {}

    toString(): string {
        return joinWithNewLine([
            generateMap(this.map),
            this.generateTableSql()
        ])
    }
}

export type By<T> = (x: T) => number|string

export type Order<T> = {
    by: By<T>
    direction: 'asc'|'desc'
}

export class Table<T> {
    constructor(
        private readonly constructor: Constructor<T>,
        private readonly name: string,
        private readonly predicates: Array<(x: T) => boolean> = []) {
    }

    filter(predicate: (x: T) => boolean): Table<T> {
        return new Table(this.constructor, this.name, this.predicates.concat(predicate))
    }

    sortBy(by: By<T>): SortTable<T> {
        return new SortTable(() => this.toString(), this.constructor, [{ by, direction: 'asc'}])
    }

    sortDescendinglyBy(by: By<T>): SortTable<T> {
        return new SortTable(() => this.toString(), this.constructor, [{ by, direction: 'desc'}])
    }

    select(): SelectTable<T> {
        return new SelectTable(() => this.toString(), this.constructor)
    }

    map<U>(f: (x: T) => U): MapTable<T, U> {
        return new MapTable(() => this.toString(), f)
    }

    toString(): string {
        const fromSql = generateFrom(this.name)
        const filterSql = this.predicates.length > 0 ? generateFilter(this.predicates) : null

        return joinNonNullWithNewLine([
            fromSql,
            filterSql])
    }
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

export function createTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table<T>(constructor, name)
}