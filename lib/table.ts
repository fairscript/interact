import {generateFrom} from './parsing/from'
import {joinNonNullWithNewLine} from './parsing/parsing'
import {generateFilter} from './parsing/filter'
import {SelectTable} from './queries/selection'
import {MapTable} from './queries/mapping'
import {By, SortTable} from './queries/sorting'
import {GroupTable} from './queries/grouping'

export interface Constructor<T> {
    new (...args: any[]): T
}

class Table<T> {
    constructor(
        private readonly constructor: Constructor<T>,
        private readonly name: string,
        private readonly predicates: Array<(x: T) => boolean> = []) {
    }

    filter(predicate: (x: T) => boolean): Table<T> {
        return new Table(this.constructor, this.name, this.predicates.concat(predicate))
    }

    sortBy(by: By<T>): SortTable<T> {
        return new SortTable(() => this.toString(), this.constructor, [{ by, direction: 'asc' }])
    }

    sortDescendinglyBy(by: By<T>): SortTable<T> {
        return new SortTable(() => this.toString(), this.constructor, [{ by, direction: 'desc' }])
    }

    select(): SelectTable<T> {
        return new SelectTable(() => this.toString(), this.constructor)
    }

    map<U>(f: (x: T) => U): MapTable<T, U> {
        return new MapTable(() => this.toString(), f)
    }

    groupBy<K>(getKey: (x: T) => K) : GroupTable<T, K>{
        return new GroupTable<T, K>(() => this.toString(), getKey)
    }

    toString(): string {
        const fromSql = generateFrom(this.name)
        const filterSql = this.predicates.length > 0 ? generateFilter(this.predicates) : null

        return joinNonNullWithNewLine([
            fromSql,
            filterSql])
    }
}

export function createTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table<T>(constructor, name)
}