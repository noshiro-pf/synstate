---
prev: false
next: false
title: createEventEmitter
sidebar:
    order: 21
---

## Example

```tsx
const [click$, emitClick] = createEventEmitter();

const clickCount = { value: 0 };

click$.subscribe(() => {
    clickCount.value += 1;
});

emitClick(); // logs: Clicked!

assert.deepStrictEqual(clickCount.value, 1);

emitClick();

emitClick();

assert.deepStrictEqual(clickCount.value, 3);
```
