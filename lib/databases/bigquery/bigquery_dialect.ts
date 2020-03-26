import {Dialect} from '../dialects'

export const bigQueryDialect: Dialect = {
    aliasEscape: '`',
    namedParameterPrefix: '@',
    useNamedParameterPrefixInRecord: false
}