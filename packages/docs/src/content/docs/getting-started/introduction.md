---
title: Introduction
sidebar:
    order: 1
---

<p align="center">
  <img src="/synstate/synstate-icon.png" alt="SynState Logo" width="400" />
</p>

**SynState** is a lightweight, high-performance, type-safe state management library for TypeScript/JavaScript applications. Perfect for building reactive global state and event-driven systems in React, Vue, and other frameworks.

"SynState" is named after "Synchronized + State." It represents a sound synchronized state through a **glitch-free** Observable implementation.

:::note
For a detailed explanation of glitches and how SynState solves them, see [How SynState Solved the Glitch](/synstate/guides/how-synstate-solved-the-glitch/).
:::

## Features

- 🎯 **Simple State Management**: Easy-to-use `createState` and `createReducer` similar to React `useState`/`useReducer` for global state
- ⚡ **High Performance**: Optimized for fast state updates and minimal re-renders
- 🎨 **Type-Safe**: Full TypeScript support with precise type inference
- 🚀 **Lightweight**: <!-- bundle-size:synstate -->~4.2 kB min+gzip<!-- /bundle-size:synstate --> with only one external runtime dependency ([ts-data-forge](https://www.npmjs.com/package/ts-data-forge))
- 🌐 **Framework Agnostic**: Works with React, Vue, Angular, or vanilla JavaScript
- 🔄 **Reactive Updates**: Automatic propagation of state changes to all subscribers
- 📡 **Event System**: Built-in `createValueEmitter`, `createEventEmitter` for event-driven architecture
- 🔧 **Observable-based**: Built on Observable pattern similar to RxJS, but with a completely independent implementation from scratch — not a wrapper. Offers optional advanced features like operators (`map`, `filter`, `scan`, `debounce`) and combinators (`merge`, `combine`)

## Quick Example

With a single call to `createState`, you can add global state to your application:

```tsx
import { createState } from 'synstate';

// Create a reactive state
const [state, setState] = createState(0);

// Subscribe to changes
state.subscribe((count) => {
    console.log(count); // 0, 1
});

// Update state
setState(1);
```

`createState` creates a reactive state and a setter function. Subscribers are notified immediately with the initial value, and again whenever the state is updated.

### What is an Observable?

In SynState, an **Observable** is a reactive value container that notifies subscribers whenever its value changes. Unlike a plain variable, an Observable allows you to _react_ to state changes declaratively.

The three main methods you'll use are:

| Method           | Description                                         |
| ---------------- | --------------------------------------------------- |
| `getSnapshot()`  | Synchronously read the current value                |
| `subscribe(fn)`  | Register a callback that runs on every value change |
| `pipe(operator)` | Transform the Observable into a new Observable      |

Here is how these methods relate to each other:

```
                    pipe(map(x => x * 2))
                 ┌─────────────────────────┐
                 │                         ▼
┌──────────────────────┐           ┌─────────────────────────┐
│  state (Observable)  │           │  derived (Observable)   │
│  value: 1            │           │  value: 2               │
└────┬─────────────────┘           └────┬────────────────────┘
     │                                  │
     │ getSnapshot()                    │ subscribe(fn)
     │   → 1                            │   → fn(2) is called
     │                                  │     on every change
     │ subscribe(fn)                    │
     │   → fn(1)                        │ getSnapshot()
     │                                  │   → 2
     └───────────────────────           └────────────────────────
```

For example:

```tsx
import { combine, createState, InitializedObservable, map } from 'synstate';

const [count, setCount] = createState<number>(0);

// Read the current value
console.log(count.getSnapshot().value); // 0

// Derive new Observables using pipe
const doubled: InitializedObservable<number> = count.pipe(map((n) => n * 2));

// Combine multiple Observables
const combined: InitializedObservable<string> = combine([count, doubled]).pipe(
    map(([c, d]) => `count=${c}, doubled=${d}`),
);

// Subscribe to changes
count.subscribe((value) => {
    console.log('count:', value); // 0, 1, 2, 3, 4
});

doubled.subscribe((value) => {
    console.log('doubled:', value); // 0, 2, 4, 6, 8
});

combined.subscribe((value) => {
    console.log(value); // "count=0, doubled=0", "count=1, doubled=2", ...
});

let cnt = 0;

const timer = setInterval(() => {
    cnt += 1;

    setCount(cnt);
}, 1000 /* ms */);

setTimeout(() => {
    clearTimeout(timer);
}, 5000);
```

Although `createState` looks similar to React's `useState`, it is fundamentally different. The first element of the return value is an `InitializedObservable<T>` — a specialized Observable provided by SynState that always holds an initial value — not a plain value.

### `createState` does not work correctly inside React components

`createState` does not work correctly inside React components (which are re-evaluated on every render) and must be called at the global scope.

```ts
import type * as React from 'react';
import { createState } from 'synstate';

// Create a reactive state

const SomeComponent = (): React.JSX.Element => {
    const [state, setState] = createState(0); // 🚫 Don't do this!!!

    // ...
};
```

To use it with React, you need to subscribe to the `InitializedObservable` inside your components — via `useSyncExternalStore` (React 18+) or `useState` + `useEffect` (React 17 and earlier). But don't worry: SynState provides `synstate-react-hooks`, a companion package that handles this for you. With it, you can introduce global state that is easily subscribable inside React components:

```tsx
import type * as React from 'react';
import { createState } from 'synstate-react-hooks';

const [useUserState, setUserState] = createState({
    name: '',
    email: '',
});

const UserProfile = (): React.JSX.Element => {
    const user = useUserState();

    return (
        <div>
            <p>
                {'Name: '}
                {user.name}
            </p>
            <button
                onClick={() => {
                    setUserState({
                        name: 'Alice',
                        email: 'alice@example.com',
                    });
                }}
            >
                {'Set User'}
            </button>
        </div>
    );
};
```

By using global state instead of React's `useState`, it becomes easy to hold application state that spans beyond a single component — such as [Dark Mode toggling](/synstate/examples/react/#boolean-state-dark-mode) or [Cross-Component Communication](/synstate/examples/react/#cross-component-communication).

For more details, see [React Integration](/synstate/guides/react-integration/).

## Next Steps

- [Installation](/synstate/getting-started/installation/) — Install SynState and optional companion packages
- [Why SynState?](/synstate/guides/why-synstate/) — Learn about the design philosophy and use cases
- [React Integration](/synstate/guides/react-integration/) — Use SynState with React
