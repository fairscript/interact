import {generateSelect} from './select'
import {generateFrom} from './from'
import {joinNonNullWithNewLine} from './parsing'
import {generateMap} from './map'
import {generateFilter} from './filter'

export interface Constructor<T> {
    new (...args: any[]): T
}

class SelectTable<T> {
    private readonly selectSql: string

    constructor(private table: Table<T>) {
        this.selectSql = generateSelect(this.table.constructor)
    }

    toString(): string {
        return joinNonNullWithNewLine([
            this.selectSql,
            this.table.fromSql,
            this.table.filterSql
        ])
    }
}

class MapTable<T, U> {
    private readonly mapSql: string

    constructor(private table: Table<T>, private map: (x: T) => U) {
        this.mapSql = generateMap(this.map)
    }

    toString(): string {
        return joinNonNullWithNewLine([
            this.mapSql,
            this.table.fromSql,
            this.table.filterSql
        ])
    }
}

export class Table<T> {
    public readonly fromSql: string
    public readonly filterSql: string

    constructor(
        public readonly constructor: Constructor<T>,
        public readonly name: string,
        public readonly predicates: Array<(x: T) => boolean> = []) {

        this.fromSql = generateFrom(this.name)
        this.filterSql = this.predicates.length > 0 ? generateFilter(this.predicates) : null
    }

    filter(predicate: (x: T) => boolean): Table<T> {
        return new Table(this.constructor, this.name, this.predicates.concat(predicate))
    }

    select(): SelectTable<T> {
        return new SelectTable(this)
    }

    map<U>(f: (x: T) => U): MapTable<T, U> {
        return new MapTable(this, f)
    }
}

export function createTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table<T>(constructor, name)
}