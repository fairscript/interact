import * as A from 'arcsecond'

export function createChoiceFromStrings(names: string[]) {
    return A.choice(names.map(A.str))
}