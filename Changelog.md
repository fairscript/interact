# Changelog

## v0.17.0
- Removed BigQuery support

## v0.16.1
- Aggregation of Boolean columns, including integration tests
- Improved readme
- Included examples from the docs directory in the readme
- Added integration tests for subqueries
- Averaging now always returns a float, removed string averaging

## v0.16.0
- Integration test suites for all three supported databases
- Specification of integer/float column types
- Boolean<=>Integer mapping in SQLite
- Maximization/minimization of boolean columns in Postgres
- Adaptation of Postgres client result types
- Fixed return types of aggregation methods  

## v0.15.5
- Fixed negations
- Added filtering integration tests for SQLite

## v0.15.4
- Replaced the use of constructors with column specifications
- Updated the project readme

## v0.15.3
- Column type specification
- Fixed multi-table selections
- Map numbers back to booleans in SQLite
- SQLite integration tests
- Expectation of single rows
- Filtering in sorted tables

## v0.15.2
- Set publishConfig

## v0.15.1
- Same Readme.md file in project root and interact package 

## v0.15.0
- Set up Lerna
- Moved database-specific code to separate modules

## v0.14.1
- Package scope

## v0.14.0
- Publication to NPM

## v0.13.2
- Renamed project to "interact".

## v0.13.1
- Fixed the signature of th aggregate method in classes representing joins.
- Rewrote test suite for Table, JoinSecondTable and JoinThirdTable. 

## v0.13.0
- Joins of up to five tables

## v0.12.2
- Terminology changes (literals, boolean expression, value expressions)
- Replaced mapS/filterP with overloads of map/filter

## v0.12.1
- Booleans
- Negation
- Evaluation of Boolean values

## v0.12.0
- not equal to, IS NULL, IS NOT NULL

## v0.11.1
- Column aggregation in subselects

## v0.11.0
- Aggregation without grouping

## v0.10.3
- Group ordering by aggregations

## v0.10.2
- DISTINCT selection

## v0.10.1
- OFFSET setting

## v0.10.0
- LIMIT clause

## v0.9.2
- Exported factory functions for PostgreSQL/BigQuery contexts

## v0.9.1
- BigQuery support
- Fixed column names in single table selections

## v0.9.0
- PostgreSQL support

## v0.8.1
- Escaped underscores in property names of user-provided filter parameters

## v0.8
- Parameterized filters

## v0.7.1
- Parallel queries

## v0.7
- Basic object-relational mapping support for SQLite

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

- Count in grouped tables is now defined on the table-level

## v0.6

- Count subqueries with one or more filters

## v0.5.4

- Greater than, greater than or equal to, less than or equal to, less than
- Table columns and constants can now be on both sides of a comparison

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