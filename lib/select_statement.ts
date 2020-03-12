import {PredicateExpression} from './parsing/predicate_parsing'
import {OrderExpression} from './parsing/order_parsing'
import {Get, PropertyOperation} from './parsing/select_parsing'

export interface Constructor<T> {
    new (...args: any[]): T
}

export interface SelectStatement {
    tableName: string
    selection: PropertyOperation[]
    predicates: PredicateExpression[]
    orders: OrderExpression[]
    key: Get[]|null
}

