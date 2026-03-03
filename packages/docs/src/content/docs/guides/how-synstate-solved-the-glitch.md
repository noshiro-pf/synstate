---
title: How SynState Solved the Glitch
sidebar:
    order: 3
---

## What Is a Glitch?

In reactive programming, a **glitch** is a phenomenon where derived values temporarily enter **inconsistent intermediate states** during propagation. When a single source value changes, Observables that depend on it may update one at a time rather than all at once. If a downstream Observable depends on multiple upstream values that share a common ancestor, it can observe a state where some inputs have already updated while others have not — producing a value that should never logically exist.

## A Simple Example

Consider the following Observable graph:

```txt
counterObservable (source)
    ├──────────────────────────┐
    │                          │
    ▼                          ▼
multipliedCounter          counterObservable
 (= counter × 1000)           (passed through)
    │                          │
    └───────────┬──────────────┘
                ▼
          combine([multipliedCounter, counterObservable])
                │
                ▼
              sum
         (= multiplied + counter)
```

In code:

```tsx
import { collectToArray, combine, counter, map, take } from 'synstate';

const counterObservable = counter(1000 /* ms */);
// 0, 1, 2, 3, ...

const multipliedCounter = counterObservable.pipe(map((count) => count * 1000));
// 0, 1000, 2000, 3000, ...

const sum = combine([multipliedCounter, counterObservable]).pipe(
    map(([a, b]) => a + b),
);
// 0, 1001, 2002, 3003, ...

const resultPromise = collectToArray(sum.pipe(take(5)));

counterObservable.start();

const result = await resultPromise;

assert.deepStrictEqual(result, [0, 1001, 2002, 3003, 4004]);
```

Both `multipliedCounter` and the second input to `combine` originate from the same source (`counterObservable`). Whenever `counterObservable` emits a new value, both inputs to `combine` should update **together** — and `sum` should always equal `counter * 1001`.

## What Happens in RxJS (Glitch)

In RxJS, `combineLatest` propagates a new value **as soon as any one input changes**. When `counterObservable` emits a new value, the update propagates through the graph in a depth-first manner. Since `multipliedCounter` subscribes to `counterObservable` before `combineLatest` does, the typical sequence when the counter changes from `0` to `1` is:

1. `counterObservable` emits `1`
2. `multipliedCounter` (which subscribes to `counterObservable`) recalculates to `1000`
3. `combineLatest` sees that `multipliedCounter` (its first input) changed to `1000`, but its second input (`counterObservable`) is still `0` (the old value)
4. `combineLatest` emits `[1000, 0]` → `sum` emits **`1000`** — a **glitch**
5. `combineLatest`'s own subscription to `counterObservable` fires with `1`
6. `combineLatest` emits `[1000, 1]` → `sum` emits `1001` — correct

This pattern repeats every time the counter increments:

```txt
counter:     0     1             2             3
             │     │             │             │
sum (RxJS):  0     1000, 1001   2001, 2002   3002, 3003   ...
                   ↑             ↑             ↑
                   glitch        glitch        glitch
```

The full output sequence of `sum` in RxJS is:

```txt
0, 1000, 1001, 2001, 2002, 3002, 3003, ...
```

The values `1000`, `2001`, `3002`, ... are **glitches** — they represent states where `multipliedCounter` has already updated but `counterObservable` has not yet propagated to `combineLatest`. These values should never exist logically (`sum` should always be a multiple of `1001`), yet they are emitted to subscribers, potentially causing incorrect UI rendering, invalid API calls, or subtle bugs.

You can verify this behavior by running the RxJS sample code in [`01-simple-glitch-example.rxjs.mts`](https://github.com/noshiro-pf/synstate/blob/main/packages/docs/samples/how-synstate-solved-the-glitch/01-simple-glitch-example.rxjs.mts).

```tsx
import {
    combineLatest,
    interval,
    lastValueFrom,
    map,
    take,
    toArray,
} from 'rxjs';

const counterObservable = interval(100);
// 0, 1, 2, 3, ...

const multipliedCounter = counterObservable.pipe(map((count) => count * 1000));
// 0, 1000, 2000, 3000, ...

const sum = combineLatest([multipliedCounter, counterObservable]).pipe(
    map(([a, b]) => a + b),
);
// 0, 1000, 1001, 2001, 2002, 3002, 3003, ...

const result = await lastValueFrom(sum.pipe(take(7), toArray()));

assert.deepStrictEqual(result, [0, 1000, 1001, 2001, 2002, 3002, 3003]);
```

### Timeline

| Step | `counterObservable` | `multipliedCounter` | `sum` (`multiplied + counter`) | Consistent? |
| ---: | ------------------: | ------------------: | -----------------------------: | :---------: |
|    1 |                   0 |                   0 |                        **0** ✓ |     Yes     |
|    2 |                   1 |                1000 |                     **1000** ✗ |   Glitch    |
|    3 |                   1 |                1000 |                     **1001** ✓ |     Yes     |
|    4 |                   2 |                2000 |                     **2001** ✗ |   Glitch    |
|    5 |                   2 |                2000 |                     **2002** ✓ |     Yes     |
|    6 |                   3 |                3000 |                     **3002** ✗ |   Glitch    |
|    7 |                   3 |                3000 |                     **3003** ✓ |     Yes     |

### Diagram

The following diagram illustrates how the glitch occurs in RxJS's `combineLatest`:

<iframe src="/synstate/rxjs-glitch-diagram.pdf" width="100%" height="600px" style="border: none;"></iframe>

## What Happens in MobX (Glitch-Free)

MobX takes a fundamentally different approach from RxJS. While RxJS is push-based (values are eagerly propagated to subscribers as soon as they change), MobX's `computed` values are **pull-based and lazily evaluated** — they are only recomputed when accessed.

When `counter` changes:

1. `multipliedCounter` and `sum` are both marked as "possibly stale"
2. MobX schedules the `reaction` (subscriber) to run after the current action completes
3. When the reaction runs, it accesses `sum`, which accesses `multipliedCounter`
4. `multipliedCounter` is recomputed from the already-updated `counter`
5. `sum` is then computed with both up-to-date values

Because `computed` values are lazily evaluated at the time of access, MobX never observes an inconsistent intermediate state in this scenario.

You can verify this behavior by running the MobX sample code in [`01-simple-glitch-example.mobx.mts`](https://github.com/noshiro-pf/synstate/blob/main/packages/docs/samples/how-synstate-solved-the-glitch/01-simple-glitch-example.mobx.mts).

```tsx
import { computed, observable, reaction, runInAction } from 'mobx';

const state = observable({ counter: 0 });

const multipliedCounter = computed(() => state.counter * 1000);
// 0, 1000, 2000, 3000, ...

const sum = computed(() => multipliedCounter.get() + state.counter);
// Expected: 0, 1001, 2002, 3003, ...

const valueHistory: number[] = [];

const dispose = reaction(
    () => sum.get(),
    (value) => {
        valueHistory.push(value);
    },
    { fireImmediately: true },
);

await new Promise<void>((resolve) => {
    let mut_count = 0;

    const interval = setInterval(() => {
        mut_count += 1;

        runInAction(() => {
            state.counter = mut_count;
        });

        if (mut_count >= 4) {
            clearInterval(interval);

            dispose();

            resolve();
        }
    }, 100);
});

// MobX computed values are lazily evaluated:
// when `sum` is accessed, it first recomputes `multipliedCounter`,
// so all values are consistent — no glitch.
assert.deepStrictEqual(valueHistory, [0, 1001, 2002, 3003, 4004]);
```

## What Happens in Jotai (Glitch-Free)

Jotai uses an **atom-based** model where derived atoms can form a dependency graph — including diamond dependencies. Like MobX, derived atoms are **lazily evaluated**: when a subscriber reads `sumAtom`, it triggers recomputation of `multipliedAtom` first, ensuring all values are consistent.

You can verify this behavior by running the Jotai sample code in [`01-simple-glitch-example.jotai.mts`](https://github.com/noshiro-pf/synstate/blob/main/packages/docs/samples/how-synstate-solved-the-glitch/01-simple-glitch-example.jotai.mts).

```tsx
import { atom, createStore } from 'jotai/vanilla';

// Jotai supports diamond dependencies natively through derived atoms.
// Derived atoms are lazily evaluated — when a subscriber reads `sumAtom`,
// it triggers recomputation of `multipliedAtom` first,
// so all values are always consistent.

const counterAtom = atom(0);

const multipliedAtom = atom((get) => get(counterAtom) * 1000);
// 0, 1000, 2000, 3000, ...

const sumAtom = atom((get) => get(multipliedAtom) + get(counterAtom));
// Expected: 0, 1001, 2002, 3003, ...

const store = createStore();

// Record initial value
const valueHistory: number[] = [store.get(sumAtom)];

// Subscribe to future changes
store.sub(sumAtom, () => {
    valueHistory.push(store.get(sumAtom));
});

await new Promise<void>((resolve) => {
    let mut_count = 0;

    const interval = setInterval(() => {
        mut_count += 1;

        store.set(counterAtom, mut_count);

        if (mut_count >= 4) {
            clearInterval(interval);

            resolve();
        }
    }, 100);
});

// Jotai derived atoms are lazily evaluated (like MobX computed),
// so diamond dependencies are always consistent — no glitch.
assert.deepStrictEqual(valueHistory, [0, 1001, 2002, 3003, 4004]);
```

## What Happens in Redux / Zustand (No Diamond Dependency)

Redux and Zustand use a **single immutable state tree**. Derived values are not computed through a propagation graph but through **selector functions** — pure functions that take the current state snapshot and return a derived value.

Since all selectors read from the same state snapshot, there is no ordering problem — `multiplied` and `counter` are always derived from the same version of the state. **Diamond dependencies are structurally impossible** in this model.

However, this single-store model has a trade-off: it does not natively support reactive stream operations like `debounce`, `switchMap`, or `mergeMap`. For such use cases, you would need to add middleware or external libraries.

### Redux

You can verify this behavior by running the Redux sample code in [`01-simple-glitch-example.redux.mts`](https://github.com/noshiro-pf/synstate/blob/main/packages/docs/samples/how-synstate-solved-the-glitch/01-simple-glitch-example.redux.mts).

```tsx
import { configureStore, createSelector, createSlice } from '@reduxjs/toolkit';

// Redux uses a single immutable state tree.
// Derived values are computed via "selectors" — pure functions
// that read from the state snapshot.
// Since all selectors read from the same snapshot,
// there is no propagation graph and thus no diamond dependency.

const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
        set: (state, action: Readonly<{ payload: number }>) => {
            state.value = action.payload;
        },
    },
});

const store = configureStore({ reducer: counterSlice.reducer });

const selectCounter = (state: Readonly<{ value: number }>): number =>
    state.value;

const selectMultiplied = createSelector(
    selectCounter,
    (counter) => counter * 1000,
);

const selectSum = createSelector(
    selectMultiplied,
    selectCounter,
    (multiplied, counter) => multiplied + counter,
);

// Record initial value
const valueHistory: number[] = [selectSum(store.getState())];

// Subscribe to future changes
store.subscribe(() => {
    valueHistory.push(selectSum(store.getState()));
});

await new Promise<void>((resolve) => {
    let mut_count = 0;

    const interval = setInterval(() => {
        mut_count += 1;

        store.dispatch(counterSlice.actions.set(mut_count));

        if (mut_count >= 4) {
            clearInterval(interval);

            resolve();
        }
    }, 100);
});

// Redux selectors always read from a single consistent state snapshot,
// so diamond dependencies are structurally impossible — no glitch.
assert.deepStrictEqual(valueHistory, [0, 1001, 2002, 3003, 4004]);
```

### Zustand

You can verify this behavior by running the Zustand sample code in [`01-simple-glitch-example.zustand.mts`](https://github.com/noshiro-pf/synstate/blob/main/packages/docs/samples/how-synstate-solved-the-glitch/01-simple-glitch-example.zustand.mts).

```tsx
import { createStore } from 'zustand/vanilla';

// Zustand uses a single store object, similar to Redux.
// Derived values are computed via selector functions
// that read from the store's state snapshot.
// Since all selectors read from the same snapshot,
// there is no propagation graph and thus no diamond dependency.

const store = createStore<Readonly<{ counter: number }>>()(() => ({
    counter: 0,
}));

const selectSum = (state: Readonly<{ counter: number }>): number =>
    state.counter * 1000 + state.counter;

// Record initial value
const valueHistory: number[] = [selectSum(store.getState())];

// Subscribe to future changes
store.subscribe((state) => {
    valueHistory.push(selectSum(state));
});

await new Promise<void>((resolve) => {
    let mut_count = 0;

    const interval = setInterval(() => {
        mut_count += 1;

        store.setState({ counter: mut_count });

        if (mut_count >= 4) {
            clearInterval(interval);

            resolve();
        }
    }, 100);
});

// Zustand selectors always read from a single consistent state snapshot,
// so diamond dependencies are structurally impossible — no glitch.
assert.deepStrictEqual(valueHistory, [0, 1001, 2002, 3003, 4004]);
```

## What Happens in SynState (Glitch-Free)

SynState solves this by ensuring that **all derived values update atomically within a single propagation cycle**. When `counterObservable` emits a new value, SynState does not immediately fire `combine`. Instead, it first propagates the update through the entire graph, updating `multipliedCounter` and marking `counterObservable`'s new value — and only after all inputs to `combine` are up-to-date does it evaluate `combine` and emit to `sum`.

The output of `sum` in SynState is:

```txt
0, 1001, 2002, 3003, 4004, ...
```

No intermediate states. No glitches. Every value emitted to subscribers is consistent.

### Timeline

| Step | `counterObservable` | `multipliedCounter` | `sum` (`multiplied + counter`) | Consistent? |
| ---: | ------------------: | ------------------: | -----------------------------: | :---------: |
|    1 |                   0 |                   0 |                        **0** ✓ |     Yes     |
|    2 |                   1 |                1000 |                     **1001** ✓ |     Yes     |
|    3 |                   2 |                2000 |                     **2002** ✓ |     Yes     |
|    4 |                   3 |                3000 |                     **3003** ✓ |     Yes     |

## Summary

| Library  | Approach                        | Diamond Dependency | Glitch-Free? | Output                                  |
| :------- | :------------------------------ | :----------------: | :----------: | :-------------------------------------- |
| RxJS     | Push-based Observable (eager)   |    Yes (native)    |      No      | `0, 1000, 1001, 2001, 2002, 3002, 3003` |
| MobX     | Pull-based computed (lazy)      |    Yes (native)    |     Yes      | `0, 1001, 2002, 3003, 4004`             |
| Jotai    | Pull-based derived atom (lazy)  |    Yes (native)    |     Yes      | `0, 1001, 2002, 3003, 4004`             |
| Redux    | Single store + selectors        |      N/A [^1]      |     Yes      | `0, 1001, 2002, 3003, 4004`             |
| Zustand  | Single store + selectors        |      N/A [^1]      |     Yes      | `0, 1001, 2002, 3003, 4004`             |
| SynState | Push-based Observable (ordered) |    Yes (native)    |     Yes      | `0, 1001, 2002, 3003, 4004`             |

[^1]: Redux and Zustand use a single immutable state tree with selector functions. Since all selectors read from the same state snapshot, diamond dependencies do not arise in the first place.

- **RxJS** is the only library that exhibits glitches in this scenario. Its push-based, eager propagation model notifies `combineLatest` as soon as any input changes, without waiting for other inputs sharing the same source to update.
- **MobX** and **Jotai** avoid glitches through lazy (pull-based) evaluation of derived values. When a subscriber reads a derived value, all upstream dependencies are recomputed on demand.
- **Redux** and **Zustand** avoid glitches structurally — their single-store model means all selectors always read from a consistent state snapshot. However, they cannot natively express reactive stream operations like `debounce` or `switchMap`.
- **SynState** is unique in being both push-based (like RxJS) and glitch-free. It achieves this by ordering the propagation so that all inputs to a combinator are updated before the combinator itself evaluates.
