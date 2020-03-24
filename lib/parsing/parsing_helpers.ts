import * as A from 'arcsecond'

export const join = (array: string[]) => array.join('')
export const joinWithUnderscore = (array: string[]) => array.join('_')
export const joinWithWhitespace = (array: string[]) => array.join(' ')
export const joinWithCommaWhitespace = (array: string[]) => array.join(', ')
export const joinWithNewLine = (array: string[]) => array.join('\n')

export function createChoiceFromStrings(names: string[]) {
    return A.choice(names.map(A.str))
}