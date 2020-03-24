import * as assert from 'assert'
import {parseParameterizedFilter} from '../../../lib/parsing/filtering/parameterized_filter_parsing'
import {createComparison} from '../../../lib/parsing/predicate/comparison'
import {createGetColumn, createGetProvided} from '../../../lib/column_operations'
import {createConcatenation, createTailItem} from '../../../lib/parsing/predicate/concatenation'

describe('parseParameterizedFilter can parse a filter', () => {
    it('with a number parameter', () => {
        assert.deepEqual(
            parseParameterizedFilter((id, e) => e.id == id, 1, 'f1'),
            {
                tableParameterToTableAlias: {'e': 't1'},
                predicate: createComparison(createGetColumn('e', 'id'), '=', createGetProvided('f1', 'id', [])),
                parameters: {
                    '$f1_id': 1
                }
            }
        )
    })

    it('with an object parameter', () => {
        assert.deepEqual(
            parseParameterizedFilter(
                (name, e) => e.firstName == name.firstName && e.lastName == name.lastName,
                {firstName: 'John', lastName: 'Doe'},
                'f1'),
            {
                tableParameterToTableAlias: {'e': 't1'},
                predicate: createConcatenation(
                    createComparison(createGetColumn('e', 'firstName'), '=', createGetProvided('f1', 'name', ['firstName'])),
                    [
                        createTailItem('&&', createComparison(createGetColumn('e', 'lastName'), '=', createGetProvided('f1', 'name', ['lastName'])))
                    ]
                ),
                parameters: {
                    '$f1_name_firstName': 'John',
                    '$f1_name_lastName': 'Doe'
                }
            }
        )
    })

    it('with a nested object parameter', () => {
        assert.deepEqual(
            parseParameterizedFilter(
                (search, e) => e.firstName == search.name.firstName && e.lastName == search.name.lastName,
                {name:{firstName: 'John', lastName: 'Doe'}},
                'f1'),
            {
                tableParameterToTableAlias: {'e': 't1'},
                predicate: createConcatenation(
                    createComparison(createGetColumn('e', 'firstName'), '=', createGetProvided('f1', 'search', ['name', 'firstName'])),
                    [
                        createTailItem('&&', createComparison(createGetColumn('e', 'lastName'), '=', createGetProvided('f1', 'search', ['name', 'lastName'])))
                    ]
                ),
                parameters: {
                    '$f1_search_name_firstName': 'John',
                    '$f1_search_name_lastName': 'Doe'
                }
            }
        )
    })

})