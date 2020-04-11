# Joining two tables

TypeScript:
```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
    .map((e, d) => ({firstName: e.firstName, lastName: e.lastName, department: d.name}))
```

SQL:
```sql
SELECT t1.first_name AS firstName, t1.last_name as lastName, t2.name AS department
FROM employees t1
INNER JOIN departments t2 ON t1.department_id = t2.id
```

## Selecting all columns corresponding to class properties

TypeScript:
```typescript
employees
    .join(departments, e => e.departmentId, d => d.id)
    .select('employee', 'department')
```

SQL:
```sql
SELECT t1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t2.id AS department_id, t2.name AS department_name
FROM employees t1
INNER JOIN departments t2 ON t1.department_id = t2.id
```