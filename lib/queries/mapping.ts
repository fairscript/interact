import {joinWithNewLine} from '../parsing/parsing'
import {generateMap} from '../parsing/map'

export class MapTable<T, U> {
    constructor(
        private readonly generateTableSql: () => string,
        private readonly map: (x: T) => U) {
    }

    toString(): string {
        return joinWithNewLine([
            generateMap(this.map),
            this.generateTableSql()
        ])
    }
}