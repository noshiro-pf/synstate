---
prev: false
next: false
title: pairwise
sidebar:
    order: 80
---

## Example

```tsx
//  Timeline:
//
//  num$      1     2     3     4
//  pairs$          [1,2] [2,3] [3,4]
//
//  Explanation:
//  - pairwise emits the current and previous values as a tuple
//  - Nothing is emitted for the first value (no previous value yet)
//  - Useful for tracking changes between consecutive values

const num$ = source<number>();

const pairs$ = num$.pipe(pairwise());

const valueHistory: (readonly [number, number])[] = [];

pairs$.subscribe(([prev, curr]) => {
    valueHistory.push([prev, curr]);
});

num$.next(1); // nothing logged

assert.deepStrictEqual(valueHistory, []);

num$.next(2); // logs: 1, 2

assert.deepStrictEqual(valueHistory, [[1, 2]]);

num$.next(3); // logs: 2, 3

assert.deepStrictEqual(valueHistory, [
    [1, 2],
    [2, 3],
]);

num$.next(4); // logs: 3, 4

assert.deepStrictEqual(valueHistory, [
    [1, 2],
    [2, 3],
    [3, 4],
]);
```
