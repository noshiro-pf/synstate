---
prev: false
next: false
title: mapResultOk
sidebar:
    order: 45
---

<!-- jsdoc-description -->

Transforms the success value (`Ok`) of a `Result` type emitted by the source.
If the value is `Ok`, the mapping function is applied; if `Err`, it remains unchanged.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  result$   Ok(2)      Err("e")   Ok(5)
//  doubled$  Ok(4)      Err("e")   Ok(10)
//
//  Explanation:
//  - mapResultOk transforms the Ok value of Result emissions
//  - Err values pass through unchanged

const result$ = source<Result<number, string>>();

const doubled$ = result$.pipe(mapResultOk((x) => x * 2));

const valueHistory: Result<number, string>[] = [];

doubled$.subscribe((v) => {
    valueHistory.push(v);
});

result$.next(Result.ok(2));

assert.deepStrictEqual(valueHistory, [Result.ok(4)]);

result$.next(Result.err('e'));

assert.deepStrictEqual(valueHistory, [Result.ok(4), Result.err('e')]);

result$.next(Result.ok(5));

assert.deepStrictEqual(valueHistory, [
    Result.ok(4),
    Result.err('e'),
    Result.ok(10),
]);
```
