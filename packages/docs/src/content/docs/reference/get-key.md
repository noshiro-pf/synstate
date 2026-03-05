---
prev: false
next: false
title: getKey (pluck)
sidebar:
    order: 42
---

<!-- jsdoc-description -->

Extracts a property value from each emitted object by key.
Equivalent to `map(value => value[key])`.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline:
//
//  user$   { name: "Alice", age: 25 }   { name: "Bob", age: 30 }
//  name$   "Alice"                       "Bob"
//
//  Explanation:
//  - getKey extracts a property value from each emitted object
//  - Equivalent to map(value => value[key])

const user$ = source<{ name: string; age: number }>();

const name$ = user$.pipe(getKey('name'));

const valueHistory: string[] = [];

name$.subscribe((name) => {
    valueHistory.push(name);
});

user$.next({ name: 'Alice', age: 25 });

assert.deepStrictEqual(valueHistory, ['Alice']);

user$.next({ name: 'Bob', age: 30 });

assert.deepStrictEqual(valueHistory, ['Alice', 'Bob']);
```
