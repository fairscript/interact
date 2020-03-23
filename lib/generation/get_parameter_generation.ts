import {GetParameter,} from '../column_operations'

export function generateGetParameter(get: GetParameter): string {
    let parts = [get.prefix, get.placeholder]

    if (get.path !== null) {
        parts.push(get.path)
    }

    return ':' + parts.join('_')
}

