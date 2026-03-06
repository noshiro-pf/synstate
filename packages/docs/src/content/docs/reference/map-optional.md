---
prev: false
next: false
title: mapOptional
sidebar:
    order: 44
---

<!-- jsdoc-description -->

Transforms the inner value of an `Optional` type emitted by the source.
If the value is `Some`, the mapping function is applied; if `None`, it remains `None`.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  value$    Some(2)    None       Some(5)
//  doubled$  Some(4)    None       Some(10)
//
//  Explanation:
//  - mapOptional transforms the inner value of Optional emissions
//  - Some values are mapped; None values pass through unchanged

const value$ = source<Optional<number>>();

const doubled$ = value$.pipe(mapOptional((x) => x * 2));

const valueHistory: Optional<number>[] = [];

doubled$.subscribe((v) => {
    valueHistory.push(v);
});

value$.next(Optional.some(2));

assert.deepStrictEqual(valueHistory, [Optional.some(4)]);

value$.next(Optional.none);

assert.deepStrictEqual(valueHistory, [Optional.some(4), Optional.none]);

value$.next(Optional.some(5));

assert.deepStrictEqual(valueHistory, [
    Optional.some(4),
    Optional.none,
    Optional.some(10),
]);
```
