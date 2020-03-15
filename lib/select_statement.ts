import {PredicateExpression} from './parsing/predicate_parsing'
import {OrderExpression} from './parsing/order_parsing'
import {Get, ColumnOperation, Count} from './column_operations'
import {JoinExpression} from './parsing/join_parsing'
import {PartOfKey} from './parsing/get_key_parsing'

export interface Constructor<T> {
    new (...args: any[]): T
}

export interface SelectStatement {
    tableName: string
    selection: ColumnOperation[]
    predicates: PredicateExpression[]
    orders: OrderExpression[]
    joins: JoinExpression[]
    key: PartOfKey[]|null
}


export interface SubselectStatement {
    tableName: string
    selection: Count
    predicates: PredicateExpression[]
}

