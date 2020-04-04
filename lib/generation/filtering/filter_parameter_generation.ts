import {BooleanExpression} from '../../parsing/booleanexpressions/boolean_expression_parsing'
import {GetProvided} from '../../parsing/valuexpressions/get_provided_parsing'
import {ValueOrNestedValueRecord, ValueRecord} from '../../record'
import {computePlaceholderName} from '../get_provided_generation'
import {Filter} from '../../parsing/filtering/filter_parsing'

function getByPath(obj: {}, remainingPath: string[]): any {
    const current = obj[remainingPath[0]]

    if (remainingPath.length == 1) {
        return current
    } else {
        return getByPath(current, remainingPath.slice(1))
    }
}

function findGetProvided(predicate: BooleanExpression, collection: GetProvided[] = []): GetProvided[] {
    switch (predicate.kind) {
        case 'concatenation':
            const {head, tail} = predicate

            return tail.reduce(
                (acc, tailItem) => findGetProvided(tailItem.expression, acc),
                findGetProvided(head, collection))

        case 'comparison':
            const {left, right} = predicate

            const comparisonItems: GetProvided[] = []

            if (left.kind === 'get-provided') {
                comparisonItems.push(left)
            }

            if (right.kind === 'get-provided') {
                comparisonItems.push(right)
            }

            return collection.concat(comparisonItems)
        case 'inside':
            return findGetProvided(predicate.inside, collection)
        case 'negation':
            return findGetProvided(predicate.negated, collection)
        case 'get-column':
        case 'literal':
            return collection
        case 'get-provided':
            return collection.concat(predicate)
    }
}

function recordFilterParameters(
    namedParameterPrefix: string,
    useNamedParameterPrefixInRecord: boolean,
    predicate: BooleanExpression,
    userProvidedParameter: ValueOrNestedValueRecord): ValueRecord {

    return findGetProvided(predicate).reduce(
        (acc, item) => {
            const key = (useNamedParameterPrefixInRecord ? namedParameterPrefix : '') + computePlaceholderName(item)
            const value = item.path.length === 0 ? userProvidedParameter : getByPath(userProvidedParameter, item.path)

            acc[key] = value

            return acc
        },
        {})
}

export function generateFilterParameters(namedParameterPrefix: string, useNamedParameterPrefixInRecord: boolean, filter: Filter): ValueRecord {
    return filter.kind === 'parameterless-filter'
        ? {}
        : recordFilterParameters(namedParameterPrefix, useNamedParameterPrefixInRecord, filter.predicate, filter.userProvided)
}