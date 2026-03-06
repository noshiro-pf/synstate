---
prev: false
next: false
title: createBooleanState
sidebar:
    order: 12
---

<!-- jsdoc-description -->

Creates a reactive boolean state with convenient methods for boolean operations.
Extends `createState` with boolean-specific helpers like `toggle`, `setTrue`, and `setFalse`.

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
