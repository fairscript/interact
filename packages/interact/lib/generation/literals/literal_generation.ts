import {Literal} from '../../parsing/literals/literal'

export function generateLiteral({value}: Literal): string {
    if (typeof value === 'string') {
        return "'" + value + "'"
    } else {
        return value.toString()
    }
}