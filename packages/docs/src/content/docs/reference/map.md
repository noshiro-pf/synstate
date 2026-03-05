---
prev: false
next: false
title: map
sidebar:
    order: 40
---

## Example

```tsx
//  Timeline:
//
//  num$      "a"      "b"      "c"
//  indexed$  "0: a"   "1: b"   "2: c"
//
//  Explanation:
//  - mapWithIndex transforms each value along with its index
//  - Index starts at 0 and increments with each emission

const num$ = source<string>();

const indexed$ = num$.pipe(map((x, i) => `${i}: ${x}`));

const valueHistory: string[] = [];

indexed$.subscribe((s) => {
    valueHistory.push(s);
});

num$.next('a'); // 0: a

num$.next('b'); // 1: b

num$.next('c'); // 2: c

assert.deepStrictEqual(valueHistory, ['0: a', '1: b', '2: c']);
```
