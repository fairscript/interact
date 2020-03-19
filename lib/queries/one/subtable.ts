export interface Subtable<T> {
    filter: (predicate: (x: T) => boolean) => Subtable<T>,
    count: () => number
}

