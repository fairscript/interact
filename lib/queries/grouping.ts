import {joinWithNewLine} from '../parsing/parsing'
import {generateGroupBy} from '../parsing/group_by'

export class GroupTable<T, K> {
    constructor(
        private readonly generateTableSql: () => string,
        private readonly getKey: (x: T) => K) {
    }

    toString() {
        return joinWithNewLine([
            this.generateTableSql(),
            generateGroupBy(this.getKey)
        ])
    }
}