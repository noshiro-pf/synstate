---
prev: false
next: false
title: createBooleanState
sidebar:
    order: 12
---

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
