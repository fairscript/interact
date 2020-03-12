import {Constructor, SelectStatement} from '../select_statement'
import {SelectSqlGenerator} from '../sql_generation'
import {extractPropertiesFromConstructor} from '../parsing/select_parsing'

export class SelectTable<T> extends SelectSqlGenerator {
    constructor(constructor: Constructor<T>, existingStatement: SelectStatement) {
        super({
            ...existingStatement,
            selection: extractPropertiesFromConstructor(constructor)
        })
    }
}