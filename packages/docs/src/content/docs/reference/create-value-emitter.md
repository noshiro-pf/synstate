---
prev: false
next: false
title: createValueEmitter
sidebar:
    order: 20
---

## Example

```tsx
const [message$, emitMessage] = createValueEmitter<string>();

const messageHistory: string[] = [];

message$.subscribe((msg) => {
    messageHistory.push(msg);
});

emitMessage('Hello'); // logs: Hello

assert.deepStrictEqual(messageHistory, ['Hello']);

emitMessage('World');

assert.deepStrictEqual(messageHistory, ['Hello', 'World']);
```
