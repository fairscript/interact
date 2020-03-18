# Filtering

## Single predicate

```typescript
employees
    .filter(e => e.id == 1)
    .select()
```

```sql
SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.department_id
FROM employees t1
WHERE t1.id = 1
```

Currently, the following comparison operators are supported: *equal* ("===" or "=="), *greater than*, *greater than or equal to*, *less than* and *less than or equal to*.

## Conjunction of predicates

*First variation*

TypeScript:
```typescript
employees
   .filter(e => e.firstName == 'John' && e.lastName == 'Doe')
   .select()
   .toSql()
```

SQL:
```sql
SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.department_id
FROM employees t1
WHERE t1.first_name = 'John' AND t1.last_name = 'Doe'
```

*Second variation*

TypeScript:
```typescript
employees
    .filter(e => e.firstName == 'John')
    .filter(e => e.lastName == 'Doe')
    .select()
    .toSql()
````

SQL:
```sql
SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.department_id
FROM employees t1
WHERE (t1.first_name = 'John') AND (t1.last_name = 'Doe')
```

Predicates are put into parentheses and concatenated with the `AND` operator when the `filter` method is invoked multiple times.