# λSQL

A (proof of concept for a) (more) type-safe and FP-oriented SQL builder for TypeScript

## Getting started

### Step 1) Define a class

```typescript
class Employee {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public title: string,
        public salary: number,
        public departmentId: string) {
    }
}
```

### Step 2) Define a Table instance from this class

```typescript
import { defineTable } from 'lambda-sql'

const employees = defineTable(Employee, 'employees')
```

The `defineTable` function takes two parameters: a constructor and the database table name.

### Step 3) Start building queries

```typescript
const sql = employees
    .filter(e => e.id === 1)
    .map(e => ({ firstName: e.firstName, lastName: e.lastName }))
    .toString()
```

This generates the following SQL query:

```sql
SELECT t1.first_name AS firstName, t1.last_name AS lastName
FROM employees t1
WHERE t1.id = 1
```

## Supported queries

### Selection

TypeScript:
```typescript
const selectSql = employees
    .select()
    .toString()
``` 

SQL:
```sql
SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.department_id
FROM employees t1
```

Note that the `select` method selects all table columns that correspond to class properties and ignores fields for which there is no corresponding property.

### Mapping

#### Mapping to a value

TypeScript:
```typescript
const mapToValueSql = employees
    .map(e => e.id)
    .toString()
```

SQL:
```sql
SELECT t1.id
FROM employees t1
```  

#### Mapping to an object
TypeScript:
```typescript
const mapToObject = employees
    .map(e => ({ firstName: e.firstName, lastName: e.lastName}))
    .toString(),
```

SQL:
```sql
SELECT t1.first_name AS firstName, t1.last_name AS lastName
FROM employees t1`
```

### Filtering

#### Single predicate
```typescript
const filterWithSinglePredicate = employees
    .filter(e => e.id == 1)
    .select()

// SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.department_id
// FROM employees t1
// WHERE t1.id = 1
```

#### Conjunction of predicates

*First variation*

TypeScript:
```typescript
const filterWithConjunction1 = employees
   .filter(e => e.firstName == 'John' && e.lastName == 'Doe')
   .select()
   .toString()
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
const filterWithConjunction2 = employees
    .filter(e => e.firstName == 'John')
    .filter(e => e.lastName == 'Doe')
    .select()
    .toString()
````

SQL:
```sql
SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.department_id
FROM employees t1
WHERE (t1.first_name = 'John') AND (t1.last_name = 'Doe')
```

Predicates are put into parentheses and concatenated with the `AND` operator when the `filter` method is invoked multiple times.

### Sorting

#### By one order

##### In ascending direction

TypeScript:
```typescript
const sortBySql = employees
    .sortBy(e => e.salary)
    .map(e => e.id)
    .toString()
```

SQL:
```sql
SELECT t1.id
FROM employees t1
ORDER BY t1.salary ASC
```

##### In descending direction

TypeScript:
```typescript
const sortDescendinglyBySql = employees
    .sortDescendinglyBy(e => e.salary)
    .map(e => e.id)
    .toString()
```

SQL:
```sql
SELECT t1.id
FROM employees t1
ORDER BY t1.salary DESC
```

#### By two orders

TypeScript:
```typescript
const sortByTwoOrdersSql = employees
    .sortBy(e => e.lastName)
    .thenBy(e => e.firstName)
    .map(e => e.id)
    .toString()
```

SQL:
```sql
SELECT t1.id
FROM employees t1
ORDER BY t1.last_name ASC, t1.first_name ASC
```

### Grouping / Aggregation

TypeScript:
```typescript
const aggregationSql = employees
    .groupBy(e => ({departmentId: e.departmentId}))
    .aggregate((key, e) => ({
        departmentId: key.departmentId,
        average: e.salary.avg(),
        count: e.salary.count(),
        maximum: e.salary.max(),
        minimum: e.salary.min(),
        sum: e.salary.sum()
    }))
    .toString()
```

SQL:
```sql
SELECT
    t1.department_id AS departmentId,
    AVG(t1.salary) AS average,
    COUNT(t1.salary) AS count,
    MAX(t1.salary) AS maximum,
    MIN(t1.salary) AS minimum,
    SUM(t1.salary) AS sum
FROM employees t1
GROUP BY t1.department_id
```