---
prev: false
next: false
title: createBooleanState
sidebar:
    order: 12
---

<!-- jsdoc-description -->

Creates a reactive state container with getter and setter methods.
Provides a simple state management solution with observable state.

<!-- /jsdoc-description -->

## Example

```tsx
const [state, { setTrue, toggle }] = createBooleanState(false);

const stateHistory: boolean[] = [];

state.subscribe((value: boolean) => {
    stateHistory.push(value);
});

assert.deepStrictEqual(stateHistory, [false]);

setTrue(); // logs: true

assert.deepStrictEqual(stateHistory, [false, true]);

toggle(); // logs: false

assert.deepStrictEqual(stateHistory, [false, true, false]);

toggle(); // logs: true

assert.deepStrictEqual(stateHistory, [false, true, false, true]);
```
