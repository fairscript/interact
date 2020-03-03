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
        public departmentId: string) {
    }
}
```

### Step 2) Create a Table instance from this class

```typescript
import { createTable } from 'lambda-sql'

const employees = createTable(Employee, 'employees')
```

The `createTable` function takes two parameters: a constructor and the database table name.

### Step 3) Start building queries

```typescript
const sql = employees
    .filter(e => e.id === 1)
    .map(e => ({ firstName: e.firstName, lastName: e.lastName }))
    .toString()

// SELECT t1.first_name AS firstName, t1.last_name AS lastName
// FROM employees t1
// WHERE t1.id = 1
```