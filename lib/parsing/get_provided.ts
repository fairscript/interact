export interface GetProvided {
    kind: 'get-provided',
    prefix: string,
    placeholder: string,
    path: string[]
}

export function createGetProvided(prefix: string, placeholder: string, path: string[]): GetProvided {
    return {
        kind: 'get-provided',
        prefix,
        placeholder,
        path
    }
}

