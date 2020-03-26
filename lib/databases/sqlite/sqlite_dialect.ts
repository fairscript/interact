import {Dialect} from '../dialects'

export const sqliteDialect: Dialect = {
    aliasEscape: null,
    namedParameterPrefix: '$',
    useNamedParameterPrefixInRecord: true
}