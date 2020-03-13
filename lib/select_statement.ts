import {PredicateExpression} from './parsing/predicate_parsing'
import {OrderExpression} from './parsing/order_parsing'
import {Get, ColumnOperation} from './queries/column_operations'

export interface Constructor<T> {
    new (...args: any[]): T
}

export interface SelectStatement {
    tableName: string
    selection: ColumnOperation[]
    predicates: PredicateExpression[]
    orders: OrderExpression[]
    key: Get[]|null
}

