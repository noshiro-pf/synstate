---
prev: false
next: false
title: mapTo
sidebar:
    order: 41
---

<!-- jsdoc-description -->

Maps all emitted values to a constant value, ignoring the source values.
Equivalent to `map(() => value)`.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  click$    MouseEvent   MouseEvent   MouseEvent
//  count$    1            1            1
//
//  Explanation:
//  - mapTo maps all emitted values to a constant value
//  - Ignores the source values entirely
//  - Useful for converting events to signals

const click$ = source<string>();

const one$ = click$.pipe(mapTo(1));

const valueHistory: number[] = [];

one$.subscribe((value) => {
    valueHistory.push(value);
});

click$.next('click1');

click$.next('click2');

click$.next('click3');

assert.deepStrictEqual(valueHistory, [1, 1, 1]);
```
