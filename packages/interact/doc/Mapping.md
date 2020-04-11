# Mapping tables

## Mapping to a value

TypeScript:
```typescript
employees
    .map(e => e.id)
```

SQL:
```sql
SELECT t1.id
FROM employees t1
```  

## Mapping to an object
TypeScript:
```typescript
employees
    .map(e => ({ firstName: e.firstName, lastName: e.lastName}))
```

SQL:
```sql
SELECT t1.first_name AS firstName, t1.last_name AS lastName
FROM employees t1`
```