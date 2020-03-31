import {Value} from '../../value'

export interface Subtable<S> {
    filter: (predicate: (x: S) => boolean) => Subtable<S>,

    count: () => number,
    max<V extends Value>(f: (x: S) => V)
    min<V extends Value>(f: (x: S) => V)
    average<V extends Value>(f: (x: S) => V)
    sum<V extends Value>(f: (x: S) => V)
}

