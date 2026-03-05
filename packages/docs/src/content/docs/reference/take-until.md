---
prev: false
next: false
title: takeUntil
sidebar:
    order: 67
---

<!-- jsdoc-description -->

Emits values from the source until the notifier observable emits.
When the notifier emits, this observable completes.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  num$          1         2         stop      3 (ignored)
//  stopNotifier                      X
//  limited$      1         2         |------- (completed)
//
//  Explanation:
//  - takeUntil completes the observable when the notifier emits
//  - After stop() is called, no further values are emitted
//  - Useful for cleanup and cancellation patterns

const num$ = source<number>();

const [stopNotifier, stop_] = createEventEmitter();

const limited$ = num$.pipe(takeUntil(stopNotifier));

const valueHistory: number[] = [];

limited$.subscribe((x) => {
    valueHistory.push(x);
});

num$.next(1); // logs: 1

assert.deepStrictEqual(valueHistory, [1]);

num$.next(2); // logs: 2

assert.deepStrictEqual(valueHistory, [1, 2]);

stop_();

num$.next(3); // nothing logged (completed)

assert.deepStrictEqual(valueHistory, [1, 2]);
```
