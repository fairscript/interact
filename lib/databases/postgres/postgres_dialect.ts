import {Dialect} from '../dialects'

export const postgresDialect: Dialect = {
    aliasEscape: '"',
    namedParameterPrefix: ':',
    useNamedParameterPrefixInRecord: false
}