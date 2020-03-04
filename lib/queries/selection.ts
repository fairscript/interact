import {joinWithNewLine} from '../parsing/parsing'
import {generateSelect} from '../parsing/select'
import {Constructor} from '../table'

export class SelectTable<T> {
    constructor(
        private readonly generateTableSql: () => string,
        private readonly ctor: Constructor<T>) {
    }

    toString(): string {
        return joinWithNewLine([
            generateSelect(this.ctor),
            this.generateTableSql()
        ])
    }
}