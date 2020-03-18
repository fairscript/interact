# Getting a single column

TypeScript:
```typescript
employees
    .get(e => e.salary)
    .toSql()
```

SQL:
```sql
SELECT t1.salary
FROM employees t1
```