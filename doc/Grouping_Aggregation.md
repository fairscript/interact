# Grouping and aggregating tables

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