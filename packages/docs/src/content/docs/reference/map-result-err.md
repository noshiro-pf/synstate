---
prev: false
next: false
title: mapResultErr
sidebar:
    order: 46
---

<!-- jsdoc-description -->

Transforms the error value (`Err`) of a `Result` type emitted by the source.
If the value is `Err`, the mapping function is applied; if `Ok`, it remains unchanged.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  result$   Ok(1)    Err("bad")      Err("fail")
//  mapped$   Ok(1)    Err("BAD")      Err("FAIL")
//
//  Explanation:
//  - mapResultErr transforms the Err value of Result emissions
//  - Ok values pass through unchanged

const result$ = source<Result<number, string>>();

const mapped$ = result$.pipe(mapResultErr((e) => e.toUpperCase()));

const valueHistory: Result<number, string>[] = [];

mapped$.subscribe((v) => {
    valueHistory.push(v);
});

result$.next(Result.ok(1));

assert.deepStrictEqual(valueHistory, [Result.ok(1)]);

result$.next(Result.err('bad'));

assert.deepStrictEqual(valueHistory, [Result.ok(1), Result.err('BAD')]);

result$.next(Result.err('fail'));

assert.deepStrictEqual(valueHistory, [
    Result.ok(1),
    Result.err('BAD'),
    Result.err('FAIL'),
]);
```
