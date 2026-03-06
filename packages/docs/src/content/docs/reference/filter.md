---
prev: false
next: false
title: filter
sidebar:
    order: 60
---

<!-- jsdoc-description -->

Filters values emitted by the source observable based on a predicate function.
Only values that satisfy the predicate will be emitted by the resulting observable.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  num$          1     2     3     4     5     6
//  even$               2           4           6
//
//  Explanation:
//  - filter passes through only values that satisfy the predicate
//  - Only even numbers (2, 4, 6) are emitted

const num$ = source<number>();

const even$ = num$.pipe(filter((x) => x % 2 === 0));

const valueHistory: number[] = [];

even$.subscribe((x) => {
    valueHistory.push(x);
});

num$.next(1); // nothing logged

num$.next(2); // logs: 2

assert.deepStrictEqual(valueHistory, [2]);

num$.next(3); // nothing logged

num$.next(4); // logs: 4

assert.deepStrictEqual(valueHistory, [2, 4]);

num$.next(5);

num$.next(6);

assert.deepStrictEqual(valueHistory, [2, 4, 6]);
```
