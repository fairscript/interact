import * as assert from 'assert'
import {SelectGenerator} from '../../lib/queries/select_generators'
import {joinWithNewLine} from '../../lib/parsing/parsing_helpers'

export function checkSql<T>(generator: SelectGenerator<T>, lines: string[]) {
    const actualSql = generator.toSql()[0]
    const expectedSql = joinWithNewLine(lines)

    assert.equal(actualSql, expectedSql)
}