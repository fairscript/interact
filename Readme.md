# Interact

A database interaction library for node.js/JavaScript/TypeScript that uses code reflection to maximize type safety and minimize friction. Supports PostgreSQL, Google BigQuery and SQLite.

## Installation

Interact can be installed from npm:

```sh
npm install interact
```

There is one additional module for each of the three supported databases: 

```sh
# Required for Postgres support
npm install interact-with-postgres

# Required for Google BigQuery support
npm install interact-with-bigquery

# Required for SQLite support
npm install interact-with-sqlite
```

## Features

- [Selecting tables](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Selection.md)
- [Mapping tables](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Mapping.md)
- [Getting a single column](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Getting.md)
- [Grouping and aggregating tables](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Grouping_Aggregation.md)
- [Counting the number of rows](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Counting.md)
- [Filtering](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Filtering.md)
- [Sorting](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Sorting.md)
- [Joining two tables](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Joins.md)
- [Count subqueries with one or more filters](https://github.com/fairscript/interact/tree/master/packages/interact/doc/Subqueries.md)

## Getting started

### Step 1: Define a type

```typescript
interface Employee {
    id: number,
    firstName: string,
    lastName: string,
    title: string,
    salary: number,
    departmentId: string
    fulltime: boolean
}
```

### Step 2: Define a table

```typescript
import { defineTable } from '@fairscript/interact'

const employees = defineTable<Employee>(
    'employees',
    {
        id: 'number',
        firstName: 'string',
        lastName: 'string',
        title: 'string',
        salary: 'integer',
        departmentId: 'string',
        fulltime: 'boolean'
    })
```
`defineTable` is a generic function that expects two arguments: the database table name and a record specifying the column types for the specified type.

### Step 3) Create a database context and start running queries

```typescript
const dbContext = createSqliteContext(filename)

const query = employees
    .filter(e => e.id === 1)
    .map(e => ({ first: e.firstName, last: e.lastName }))

const namesOfEmployees = dbContext.get(query)
```

This generates the following SQL query:

```sql
SELECT t1.first_name AS first, t1.last_name AS last
FROM employees t1
WHERE t1.id = 1
```