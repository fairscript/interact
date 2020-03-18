# Counting the number of rows

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