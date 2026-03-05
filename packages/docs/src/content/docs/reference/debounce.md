---
prev: false
next: false
title: debounce
sidebar:
    order: 71
---

<!-- jsdoc-description -->

Delays emissions from the source observable until a specified time has passed without another emission.
Useful for handling user input events like typing or scrolling.

<!-- /jsdoc-description -->

## Example

```tsx
//  Timeline (300ms debounce):
//
//  Time(ms)   0     100    200    300    400    500    600   ...   900   1000
//  input$     'h'   'he'   'hel'  'hello'
//  debounced$                                          'hello' (emitted after 300ms silence)
//
//  Explanation:
//  - At 0ms: 'h' is emitted, timer starts
//  - At 100ms: 'he' is emitted, timer resets
//  - At 200ms: 'hel' is emitted, timer resets
//  - At 300ms: 'hello' is emitted, timer resets
//  - At 600ms: No new emission for 300ms, 'hello' is finally emitted

const input$ = source<string>();

const debounced$ = input$.pipe(debounce(300));

const valueHistory: string[] = [];

debounced$.subscribe((value) => {
    valueHistory.push(value);
});

input$.next('h');

input$.next('he');

input$.next('hel');

input$.next('hello');

await new Promise((resolve) => {
    setTimeout(resolve, 400);
});

assert.deepStrictEqual(valueHistory, ['hello']);
```
