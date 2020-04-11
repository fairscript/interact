# Sorting

## By one order

### In ascending direction

TypeScript:
```typescript
employees
    .sortBy(e => e.salary)
    .map(e => e.id)
```

SQL:
```sql
SELECT t1.id
FROM employees t1
ORDER BY t1.salary ASC
```

### In descending direction

TypeScript:
```typescript
employees
    .sortDescendinglyBy(e => e.salary)
    .map(e => e.id)
```

SQL:
```sql
SELECT t1.id
FROM employees t1
ORDER BY t1.salary DESC
```

## By two orders

TypeScript:
```typescript
employees
    .sortBy(e => e.lastName)
    .thenBy(e => e.firstName)
    .map(e => e.id)
```

SQL:
```sql
SELECT t1.id
FROM employees t1
ORDER BY t1.last_name ASC, t1.first_name ASC
```