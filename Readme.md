# λSQL

A (relatively) type-safe object-relational mapper for Node.js+TypeScript with a fluent API. Supports SQLite and PostgreSQL.

## Features
- [Selecting tables](doc/Selection.md)
- [Mapping tables](doc/Mapping.md)
- [Getting a single column](doc/Getting.md)
- [Grouping and aggregating tables](doc/Grouping_Aggregation.md)
- [Counting the number of rows](doc/Counting.md)
- [Filtering](doc/Filtering.md)
- [Sorting](doc/Sorting.md)
- [Joining two tables](doc/Joins.md)
- [Count subqueries with one or more filters](doc/Subqueries.md)

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

### Step 3) Create a database context and start running queries

```typescript
const dbContext = createSqliteContext(filename)

const query = employees
    .filter(e => e.id === 1)
    .map(e => ({ firstName: e.firstName, lastName: e.lastName }))

const employee = dbContext.get(query)
```

This generates the following SQL query:

```sql
SELECT t1.first_name AS firstName, t1.last_name AS lastName
FROM employees t1
WHERE t1.id = 1
```