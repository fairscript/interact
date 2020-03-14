import {Constructor, SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseMultiTableSelect} from '../../parsing/select_parsing'

export class SelectTwoTables<T1, T2> extends SelectSqlGenerator {
    constructor(
        firstConstructor: Constructor<T1>,
        secondConstructor: Constructor<T2>,
        existingStatement: SelectStatement,
        first: string,
        second: string) {

        super({
                ...existingStatement,
                selection: parseMultiTableSelect({
                    [first]: firstConstructor,
                    [second]: secondConstructor
                })
            }
        )
    }
}