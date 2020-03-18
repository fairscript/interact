export interface CountSelection {
    kind: 'count-selection'
}

export function createCountSelection(): CountSelection {
    return {
        kind: 'count-selection'
    }
}