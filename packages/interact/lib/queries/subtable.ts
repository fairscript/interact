import {Value} from '../value'

export interface Subtable<S> {
    filter: (predicate: (x: S) => boolean) => Subtable<S>

    count: () => number

    max<V extends Value>(f: (x: S) => V): V
    min<V extends Value>(f: (x: S) => V): V

    // Averaging strings hardly makes sense.
    average(f: (x: S) => number): number
    average(f: (x: S) => boolean): number

    sum(f: (x: S) => string): string
    sum(f: (x: S) => number): number
    sum(f: (x: S) => boolean): number
}

