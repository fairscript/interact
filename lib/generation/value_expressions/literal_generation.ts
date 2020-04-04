import {Literal} from '../../parsing/values/literal'

export function generateLiteral({value}: Literal): string {
    if (typeof value === 'string') {
        return "'" + value + "'"
    } else {
        return value.toString()
    }
}