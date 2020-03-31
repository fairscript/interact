import * as assert from 'assert'
import {
    createParameterizedFilter,
    parseParameterizedFilter
} from '../../../lib/parsing/filtering/parameterized_filter_parsing'
import {createGetProvided} from '../../../lib/parsing/get_provided_parsing'
import {createConcatenation, createTailItem} from '../../../lib/parsing/predicates/concatenation'
import {createComparison} from '../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../lib/parsing/get_column_parsing'

describe('parseParameterizedFilter can parse a filter', () => {
    it('with a number parameter', () => {
        assert.deepEqual(
            parseParameterizedFilter((id, e) => e.id == id, 'f1', 1),
            createParameterizedFilter(
                {'e': 't1'},
                createComparison(createGetColumn('e', 'id'), '=', createGetProvided('f1', 'id', [])),
                1
            )
        )
    })

    it('with an object parameter', () => {
        assert.deepEqual(
            parseParameterizedFilter((name, e) => e.firstName == name.firstName && e.lastName == name.lastName, 'f1', {firstName: 'John', lastName: 'Doe'}),
            createParameterizedFilter(
                {'e': 't1'},
                createConcatenation(
                    createComparison(createGetColumn('e', 'firstName'), '=', createGetProvided('f1', 'name', ['firstName'])),
                    [
                        createTailItem('&&', createComparison(createGetColumn('e', 'lastName'), '=', createGetProvided('f1', 'name', ['lastName'])))
                    ]
                ),
                {firstName: 'John', lastName: 'Doe'}
            )
        )
    })

    it('with a nested object parameter', () => {
        assert.deepEqual(
            parseParameterizedFilter((search, e) => e.firstName == search.name.firstName && e.lastName == search.name.lastName, 'f1', {
                name: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            }),
            createParameterizedFilter(
                {'e': 't1'},
                createConcatenation(
                    createComparison(createGetColumn('e', 'firstName'), '=', createGetProvided('f1', 'search', ['name', 'firstName'])),
                    [
                        createTailItem('&&', createComparison(createGetColumn('e', 'lastName'), '=', createGetProvided('f1', 'search', ['name', 'lastName'])))
                    ]
                ),
                {
                    name: {
                        firstName: 'John',
                        lastName: 'Doe'
                    }
                }
            )
        )
    })

})