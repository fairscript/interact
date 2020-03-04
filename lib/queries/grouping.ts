import {createTableFieldParser, joinWithNewLine} from '../parsing/parsing'
import {generateGroupBy, parseGetKey} from '../parsing/group_by'
import {Aggregatable} from './aggregation'
import {generateAggregate} from '../parsing/aggregate'

export class GroupTable<T, K> {
    private readonly keyProperties2TableFields: Array<[string, string]>

    constructor(
        private readonly generateTableSql: () => string,
        private readonly getKey: (x: T) => K) {

        this.keyProperties2TableFields = parseGetKey(getKey)
    }

    aggregate<A>(aggregation: (k: K, x: Aggregatable<T>) => A): AggregateTable<T, K, A> {
        return new AggregateTable(() => this.toString(), this.keyProperties2TableFields, aggregation)
    }

    toString() {
        return joinWithNewLine([
            this.generateTableSql(),
            generateGroupBy(this.keyProperties2TableFields)
        ])
    }
}

export class AggregateTable<T, K, A> {
    constructor(
        private readonly generateTableSql: () => string,
        private readonly keyProperties2TableFields: Array<[string, string]>,
        private readonly aggregation: (key: K, x: Aggregatable<T>) => A) {
    }

    toString() {

        return joinWithNewLine([
            generateAggregate(
                this.keyProperties2TableFields.reduce((dict, [key, value]) => {
                    dict[key] = value
                    return dict
                }, {}),
                this.aggregation),
            this.generateTableSql()
        ])
    }
}