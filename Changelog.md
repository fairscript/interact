# Changelog

## v0.1.0

- Initial version
- Basic support for selection, mapping and filtering

## v0.1.1

- Introduced changelog
- Described query support in the readme
- Started to use SQL syntax in the readme 

## v0.2

- Implemented basic support for sorting by multiple orders in ascending and descending direction
- Added sorting examples to the readme

## v0.3

- Tables can now be grouped.
- Fields in grouped tables can be aggregated through averaging, counting, minimization and maximization operations
- Added an aggregation example to the readme

## v0.4

- Separated parsing JavaScript code from generating SQL code
- Introduced the SelectStatement interface to represent the information required to generate a SELECT statement. 
- Introduced modeling of column-level operations
- Extended filter functionality through a new predicate parser

## v0.5

- Implemented support for joins of two tables

## v0.5.1

- Separated the selection of a single column ("get" method) from the mapping of rows to objects ("map" method)