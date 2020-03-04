import {Employee} from '../test_tables'
import {parsePredicate} from '../../lib/filter'

import * as assert from 'assert'

describe('parsePredicate', () => {
    describe('can parse strings', () => {
        describe('containing', () => {
            it('parentheses', () => {
                assert.equal(
                    parsePredicate<Employee>(e => e.title == '(text in parentheses)'),
                    "t1.title = '(text in parentheses)'")
            })

            it('escaped single quotes', () => {
                assert.equal(
                    parsePredicate<Employee>(e => e.title == 'I\'m'),
                    "t1.title = 'I\\'m'")
            })
        })

        describe('surrounded by', () => {
            it('double quotes', () => {
                assert.equal(
                    parsePredicate<Employee>(e => e.title == "text"),
                    "t1.title = 'text'")
            })
        })
    })

    it('can parse integers', () => {
        assert.equal(
            parsePredicate<Employee>(e => e.id == 1),
            "t1.id = 1")
    })

    describe('can parse expressions surrounded', () => {
        it('by a single pair of parentheses', () => {
            assert.equal(
                parsePredicate<Employee>(e => (e.firstName == 'John')),
                "(t1.first_name = 'John')")
        })

        it('by two pairs of parentheses', () => {
            assert.equal(
                parsePredicate<Employee>(e => ((e.firstName == 'John'))),
                "((t1.first_name = 'John'))")
        })
    })

    describe('can parse an equality', () => {
        it('with a double equality sign', () => {
            assert.equal(
                parsePredicate<Employee>(e => e.firstName == 'John'),
                "t1.first_name = 'John'")
        })

        it('with a triple equality sign', () => {
            assert.equal(
                parsePredicate<Employee>(e => e.firstName === 'John'),
                "t1.first_name = 'John'")
        })
    })

    describe('can parse a conjunction', () => {
        it('of two literals', () => {
            assert.equal(
                parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe'),
                "t1.first_name = 'John' AND t1.last_name = 'Doe'")
        })

        it('of two literals with parentheses around the conjunction', () => {
            assert.equal(
                parsePredicate<Employee>(e => (e.firstName == 'John' && e.lastName == 'Doe')),
                "(t1.first_name = 'John' AND t1.last_name = 'Doe')")
        })

        it('of two literals with  parentheses around the two literals', () => {
            assert.equal(
                parsePredicate<Employee>(e => (e.firstName == 'John') && (e.lastName == 'Doe')),
                "(t1.first_name = 'John') AND (t1.last_name = 'Doe')")
        })

        it('of two disjunctions', () => {
            assert.equal(
                parsePredicate<Employee>(e => (e.firstName == 'John' || e.firstName == 'Richard') && (e.lastName == 'Doe' || e.lastName == 'Roe')),
                "(t1.first_name = 'John' OR t1.first_name = 'Richard') AND (t1.last_name = 'Doe' OR t1.last_name = 'Roe')"
            )
        })
    })

    describe('can parse a disjunction', () => {

        it('of two literals', () => {
            assert.equal(
                parsePredicate<Employee>(e => e.firstName == 'Jim' || e.firstName == 'James'),
                "t1.first_name = 'Jim' OR t1.first_name = 'James'")
        })

        it('of three literals', () => {
            assert.equal(
                parsePredicate<Employee>(e => e.firstName == 'Jim' || e.firstName == 'Jimmy' || e.firstName == 'James'),
                "t1.first_name = 'Jim' OR t1.first_name = 'Jimmy' OR t1.first_name = 'James'")
        })

        it('of two conjunctions', () => {
            assert.equal(
                parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe' || e.firstName == 'Richard' && e.lastName == 'Roe'),
                "t1.first_name = 'John' AND t1.last_name = 'Doe' OR t1.first_name = 'Richard' AND t1.last_name = 'Roe'"
            )
        })

    })
})