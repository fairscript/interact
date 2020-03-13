import {TableIndex} from '../column_operations'

export function createFindTableIndex(parameters: string[]): (parameter: string) => TableIndex {
    return (parameterName: string) => {
        const index = parameters.indexOf(parameterName) + 1
        switch (index) {
            case 1:
            case 2:
                return index
            default:
                throw Error('A valid table index could not be found.')
        }
    }
}