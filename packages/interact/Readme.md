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

const namesOfEmployees = dbContext.run(query)
```

This generates the following SQL query:

```sql
SELECT t1.first_name AS first, t1.last_name AS last
FROM employees t1
WHERE t1.id = 1
```

## Selection features

### Selecting a single column

```typescript
employees.get(e => e.id)
```

### Selecting a single row

```typescript
employees
    .filter(e => e.id === 1)
    .single()
```

### Mapping over rows

```typescript
employees
	.map(e => ({ firstName: e.firstName, lastName: e.lastName }))
```

### Selecting a single table

```typescript
employees.select()
```

### Selecting multiple tables

```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
    .join(companies, d => d.companyId, c => c.id)
    .select('employee', 'department', 'company')
```

## Aggregation features

### Counting the number of rows

```typescript
employees.count()
```

### Finding the minimum value in a column

```typescript
employees.min(e => e.salary)
```

### Finding the maximum value in a column

```typescript
employees.max(e => e.salary)
```

### Computing the sum of values in a column

```typescript
employees.sum(e => e.salary)
```

### Computing the sum of values in a column

```typescript
employees.sum(e => e.average)
```

### Selecting multiple aggregations

```typescript
employees
    .aggregate((e, count) => ({
        lowestSalary: e.salary.min(),
        highestSalary: e.salary.max(),
        totalSalaries: e.salary.sum(),
        averageSalary: e.salary.average(),
        numberOfEmployees: count()
    }))
```

### Aggregate groups

```typescript
employees
    .groupBy(e => e.departmentId)
    .aggregate((key, e, count) => ({
        lowestSalary: e.salary.min(),
        highestSalary: e.salary.max(),
        totalSalaries: e.salary.sum(),
        averageSalary: e.salary.average(),
        employeesInDepartment: count()
    }))
```

## Sorting features

### Sorting in ascending order

```typescript
employees
    .sortBy(e => e.id)
    .select()
```

### Sorting in descending order

```typescript
employees
    .sortDescendinglyBy(e => e.salary)
    .select()
```

## Sorting with multiple orders

```typescript
employees
    .sortBy(e => e.departmentId)
    .thenDescendinglyBy(e => e.salary)
    .select()
```

