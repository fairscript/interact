# Selecting tables

TypeScript:
```typescript
employees
    .select()
``` 

SQL:
```sql
SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.department_id
FROM employees t1
```

Note that the `select` method selects all table columns that correspond to class properties and ignores fields for which there is no corresponding property.
