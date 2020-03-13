import {PredicateExpression} from './parsing/predicate_parsing'
import {OrderExpression} from './parsing/order_parsing'
import {Get, ColumnOperation} from './column_operations'
import {JoinExpression} from './parsing/join_parsing'

export interface Constructor<T> {
    new (...args: any[]): T
}

export interface SelectStatement {
    tableName: string
    selection: ColumnOperation[]
    predicates: PredicateExpression[]
    orders: OrderExpression[]
    joins: JoinExpression[]
    key: Get[]|null
}
