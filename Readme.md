# λSQL

A (proof of concept for a) (more) type-safe and FP-oriented SQL builder for TypeScript

## Getting started

### Step 1) Define classes

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

class Department {
    constructor(
        public id: number,
        public name: string) {
    }
}
```

### Step 2) Define tables

```typescript
import { defineTable } from 'lambda-sql'

const employees = defineTable(Employee, 'employees')
const departments = defineTable(Department, 'departments')
```

The `defineTable` function takes two parameters: a constructor and the database table name.

### Step 3) Start building queries

```typescript
employees
    .filter(e => e.id === 1)
    .map(e => ({ firstName: e.firstName, lastName: e.lastName }))
    .toSql()
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
employees
    .select()
    .toSql()
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
employees
    .map(e => e.id)
    .toSql()
```

SQL:
```sql
SELECT t1.id
FROM employees t1
```  

#### Mapping to an object
TypeScript:
```typescript
employees
    .map(e => ({ firstName: e.firstName, lastName: e.lastName}))
    .toSql(),
```

SQL:
```sql
SELECT t1.first_name AS firstName, t1.last_name AS lastName
FROM employees t1`
```

### Filtering

#### Single predicate
```typescript
employees
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

### Sorting

#### By one order

##### In ascending direction

TypeScript:
```typescript
employees
    .sortBy(e => e.salary)
    .map(e => e.id)
    .toSql()
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
employees
    .sortDescendinglyBy(e => e.salary)
    .map(e => e.id)
    .toSql()
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
employees
    .sortBy(e => e.lastName)
    .thenBy(e => e.firstName)
    .map(e => e.id)
    .toSql()
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
employees
    .groupBy(e => ({departmentId: e.departmentId}))
    .aggregate((key, e) => ({
        departmentId: key.departmentId,
        average: e.salary.avg(),
        count: e.salary.count(),
        maximum: e.salary.max(),
        minimum: e.salary.min(),
        sum: e.salary.sum()
    }))
    .toSql()
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

### Joins

#### Joining two tables

TypeScript:
```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
    .map((e, d) => ({firstName: e.firstName, lastName: e.lastName, department: d.name}))
    .toSql()
```

SQL:
```sql
SELECT t1.first_name AS firstName, t1.last_name as lastName, t2.name AS department
FROM employees t1
INNER JOIN departments t2 ON t1.department_id = t2.id
```

#### Selecting all columns corresponding to class properties

TypeScript:
```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
    .select('employee', 'department')
    .toSql()
```

SQL:
```sql
SELECT t1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t2.id AS department_id, t2.name AS department_name
FROM employees t1
INNER JOIN departments t2 ON t1.department_id = t2.id
```


### Counting

TypeScript:
```typescript
employees
    .filter(e => e.departmentId === 1)
    .count()
    .toSql()
```

SQL:
```sql
SELECT COUNT(*)
FROM employees t1
WHERE t1.department_id = 1
```