---
prev: false
next: false
title: withCurrentValueFrom (withLatestFrom)
sidebar:
    order: 83
---

<!-- jsdoc-description -->

Samples the current value from another observable each time the source emits.
Emits a tuple of [sourceValue, sampledValue].

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  name$     "Alice"           "Bob"               "Charlie"
//  age$                25              30      35              40
//  result$             ["Alice",25]  ["Bob",30]  ["Bob",35]  ["Charlie",40]
//
//  Explanation:
//  - withCurrentValueFrom samples the current value from another observable
//  - Emits a tuple [sourceValue, sampledValue] each time the source emits
//  - Does not emit until both observables have emitted at least once
//  - Similar to combine, but only emits when the source (not the sampled) emits

const name$ = source<string>();

const age$ = source<number>();

const result$ = name$.pipe(withCurrentValueFrom(age$));

const valueHistory: (readonly [string, number])[] = [];

result$.subscribe(([name_, currentAge]) => {
    valueHistory.push([name_, currentAge]);
});

name$.next('Alice'); // nothing logged (age$ hasn't emitted)

assert.deepStrictEqual(valueHistory, []);

age$.next(25);

name$.next('Bob'); // logs: Bob is 25 years old

assert.deepStrictEqual(valueHistory, [['Bob', 25]]);

age$.next(30);

name$.next('Charlie'); // logs: Charlie is 30 years old

assert.deepStrictEqual(valueHistory, [
    ['Bob', 25],
    ['Charlie', 30],
]);
```
