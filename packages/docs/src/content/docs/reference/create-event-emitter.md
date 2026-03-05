---
prev: false
next: false
title: createEventEmitter
sidebar:
    order: 21
---

<!-- jsdoc-description -->

Creates an event emitter for void events (events without payload).
Returns a tuple of [observable, emitter function].

<!-- /jsdoc-description -->

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
