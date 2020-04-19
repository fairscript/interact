# Interact

A database interaction library for node.js/JavaScript/TypeScript that uses code reflection to maximize type safety and minimize friction. Supports SQLite, PostgreSQL and Google BigQuery.

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

## Table definition

```typescript
const employees = defineTable<Employee>(
    'employees',
    {
        id: 'integer',
        firstName: 'string',
        lastName: 'string',
        title: 'string',
        salary: 'integer',
        departmentId: 'integer',
        fulltime: 'boolean'
    })

const departments = defineTable<Department>(
    'departments',
    {
        id: 'integer',
        name: 'string',
        companyId: 'integer'
    })

const companies = defineTable<Company>(
    'companies',
    {
        id: 'integer',
        name: 'string'
    })
```

## Supported databases

### In-memory SQLite

```typescript
const context = createSqliteInMemoryContext()
```

### On-disk SQLite

```typescript
const context = createSqliteOnDiskContext(filename)
```

### Postgres

```typescript
import {Client} from 'pg'

const pg = new Client(...)
                      
await pg.connect()

const context = createPostgresContext(pg)

await pg.end()
```

### BigQuery

```typescript
import {BigQuery} from '@google-cloud/bigquery'

const bigQuery = new BigQuery(...)
const context = createBigQueryContext(bigQuery, datasetName)
                              
```

## Selection

### Single column

```typescript
employees.get(e => e.id)
```

### Single row

```typescript
employees
    .filter(e => e.id === 1)
    .single()
```

### Map over rows

```typescript
employees
	.map(e => ({ firstName: e.firstName, lastName: e.lastName }))
```

### Single table

```typescript
employees.select()
```

### Limited number of rows
```typescript
employees
    .select()
    .limit(n)
```

### Limited number of rows, with an offset
```typescript
employees
    .select()
    .limit(m)
    .offset(n)
```

### Distinct rows

```typescript
employees
    .select()
    .distinct()
```

## Aggregation

### Number of rows

```typescript
employees.count()
```

### Minimum value in a column

```typescript
employees.min(e => e.salary)
```

### Maximum value in a column

```typescript
employees.max(e => e.salary)
```

### Sum of values in a column

```typescript
employees.sum(e => e.salary)
```

### Average column value

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

### Aggregating groups

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

## Filtering

### Comparison

```typescript
employees.filter(e => e.id == 1)
employees.filter(e => e.id === 1)

employees.filter(e => e.id != 1)
employees.filter(e => e.id !== 1)

employees.filter(e => e.salary > 10000)
employees.filter(e => e.salary >= 10000)
employees.filter(e => e.salary < 10000)
employees.filter(e => e.salary <= 10000)
```

### Evaluating a Boolean column

```typescript
employees.filter(e => e.fulltime)

employees.filter(e => !e.fulltime)
```

### Conjunction

```typescript
employees.filter(e => e.firstName === 'John' && e.lastName === 'Doe')

employees
    .filter(e => e.firstName === 'John')
	.filter(e => e.lastName === 'Doe')
```

### Disjunction

```typescript
employees.filter(e => e.firstName === 'Jim' && e.firstName === 'James')
```

### Conjunction of disjunctions

```typescript
employees.filter(e => (e.firstName === 'John' || e.firstName === 'Richard') && (e.firstName === 'Doe' || e.firstName === 'Roe'))
```

### Disjunction of conjunctions

```typescript
employees.filter(e => (e.firstName = 'John' && e.firstName = 'Doe') || (e.firstName = 'Richard' || e.firstName = 'Roe'))
```

### User-provided value

```typescript
employees.filter(1, (id, e) => e.id === 1)
```

### User-provided object

```typescript
employees
    .filter(
        { firstName: 'John', lastName: 'Doe' },
        (search, e) => e.firstName === search.firstName, e.lastName === search.lastName)
    )
```

## Sorting features

### Ascending order

```typescript
employees
    .sortBy(e => e.id)
    .select()
```

### Descending order

```typescript
employees
    .sortDescendinglyBy(e => e.salary)
    .select()
```

### Multiple orders

```typescript
employees
    .sortBy(e => e.departmentId)
    .thenDescendinglyBy(e => e.salary)
    .select()
```

## Joins

### Joining tables

```javascript
employees
    .join(departments, e => e.departmentId, d => d.id)
	.join(departments, e => e.companyId, c => c.id)
```

### Column from a joined table

```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
	.get((e, d) => d.name)
```

### Map over rows

```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
    .get((e, d) => {
        firstName: e.firstName,
    	lastName: e.lastName,
        department: d.name
	})
```

### Selecting multiple tables

```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
    .join(companies, d => d.companyId, c => c.id)
    .select('employee', 'department', 'company')
```

## Subqueries

### Number of rows

```typescript
employees.map(
     employees,
     (subtable, e) => ({
         id: e.id,
         departmentSize: subtable
             .filter(se => se.departmentId === e.departmentId)
             .count()
     }))
```

### Minimum value in a column

```typescript
employees.map(
     employees,
     (subtable, e) => ({
         id: e.id,
         lowestSalaryInDepartment: subtable
             .filter(se => se.departmentId === e.departmentId)
             .min(se => se.salary)
     }))
```

### Maximum value in a column

```typescript
employees.map(
     employees,
     (subtable, e) => ({
         id: e.id,
         highestSalaryInDepartment: subtable
             .filter(se => se.departmentId === e.departmentId)
             .max(se => se.salary)
     }))
```

### Sum of values in a column

```typescript
employees.map(
     employees,
     (subtable, e) => ({
         id: e.id,
         totalSalariesInDepartment: subtable
             .filter(se => se.departmentId === e.departmentId)
             .sum(se => se.salary)
     }))
```

### Average column value

```typescript
employees.map(
     employees,
     (subtable, e) => ({
         id: e.id,
         averageSalaryInDepartment: subtable.filter(se => se.departmentId === e.departmentId).average(se => se.salary)
     }))
```

## Parallel queries

```typescript
const promiseOfResults: Promise = context
	.parallelRun({
		numberOfEmployees: employees.count(),
        numberOfDepartments: departments.count(),
        numberOfCompanies: companies.count()
	})
    .then(res => {
        { numberOfEmployees, numberOfDepartments, numberOfCompanies } = res
        [...]
    })
```