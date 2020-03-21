# Count subqueries with one or more filters

TypeScript
```typescript
employees
    .mapS(
        employees,
        (st, e) => ({
            id: e.id,
            higherSalary: st.filter(se => se.salary > e.salary).count()
        }))
```

SQL:
```sql
SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS higherSalary
FROM employees t1
```

At this point, only count subqueries with one or more filters are supported.