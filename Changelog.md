# Changelog

## v0.6.7
- Unified lambda function parsing for inner and outer functions

## v0.6.6

- Fixed remaining references to get-parameter-names

## v0.6.5

- Removed the dependency on get-parameter-names

## v0.6.4

- Unified predicate parsing in queries and subqueries

## v0.6.3

- Subqueries on filtered tables, sorted tables and joins of two tables

## v0.6.2

- Subtable interface represents supported subquery operations

## v0.6.1

- Count in grouped tables is now defined on the table-level.

## v0.6

- Count subqueries with one or more filters

## v0.5.4

- Greater than, greater than or equal to, less than or equal to, less than
- Table columns and constants can now be on both sides of a comparison.

## v0.5.3

- Counting filtered and unfiltered tables

## v0.5.2

- Enforced groups and the result of maps and aggregations to be non-empty objects satisfying Record<string, Value> 

## v0.5.1

- Separated the selection of a single column ("get" method) from the mapping of rows to objects ("map" method)

## v0.5

- Joins of two tables

## v0.4

- Separated parsing JavaScript code from generating SQL code
- Introduced the SelectStatement interface to represent the information required to generate a SELECT statement. 
- Introduced modeling of column-level operations
- Extended filter functionality through a new predicate parser

## v0.3

- Tables can now be grouped.
- Fields in grouped tables can be aggregated through averaging, counting, minimization and maximization operations
- Added an aggregation example to the readme

## v0.2

- Sorting by multiple orders in ascending and descending direction
- Added sorting examples to the readme

## v0.1.1

- Introduced changelog
- Described query support in the readme
- Started to use SQL syntax in the readme

## v0.1.0

- Initial version
- Basic support for selection, mapping and filtering