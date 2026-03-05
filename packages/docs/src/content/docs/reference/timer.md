---
prev: false
next: false
title: timer
sidebar:
    order: 34
---

## Example

```tsx
//  Timeline:
//
//  Time(ms)  0     ...   1000
//  delayed$                X (emits and completes)
//
//  Explanation:
//  - timer emits once after the specified delay, then completes
//  - Useful for delayed actions or timeouts

const delayed$ = timer(100);

const valueHistory: number[] = [];

await new Promise<void>((resolve) => {
    delayed$.subscribe(
        () => {
            valueHistory.push(1);
        },
        () => {
            resolve();
        },
    );
});

assert.deepStrictEqual(valueHistory, [1]);
```
