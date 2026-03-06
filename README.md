# SynState

<p align="center">
  <img src="./packages/synstate/assets/synstate-icon.png" alt="SynState Logo" width="400" />
</p>

<p align="center">

[![npm version](https://img.shields.io/npm/v/synstate.svg)](https://www.npmjs.com/package/synstate)
[![npm downloads](https://img.shields.io/npm/dm/synstate.svg)](https://www.npmjs.com/package/synstate)
[![License](https://img.shields.io/npm/l/synstate.svg)](./LICENSE)
[![codecov](https://codecov.io/gh/noshiro-pf/synstate/graph/badge.svg?token=xrJgTVxMpr)](https://codecov.io/gh/noshiro-pf/synstate)

</p>

**SynState** is a lightweight, high-performance, type-safe state management library for TypeScript/JavaScript applications. Perfect for building reactive global state and event-driven systems in React, Vue, and other frameworks.

## Features

- 🎯 **Simple State Management**: Easy-to-use `createState` and `createReducer` similar to React `useState`/`useReducer` for global state
- ⚡ **High Performance**: Optimized for fast state updates and minimal re-renders
- 🎨 **Type-Safe**: Full TypeScript support with precise type inference
- 🚀 **Lightweight**: Minimal bundle size with only one external runtime dependency ([ts-data-forge](https://www.npmjs.com/package/ts-data-forge))
- 🌐 **Framework Agnostic**: Works with React, Vue, Svelte, or vanilla JavaScript
- 🔄 **Reactive Updates**: Automatic propagation of state changes to all subscribers
- 📡 **Event System**: Built-in `createValueEmitter`, `createEventEmitter` for event-driven architecture
- 🔧 **Observable-based**: Built on Observable pattern similar to RxJS, but with a completely independent implementation from scratch — not a wrapper. Offers optional advanced features like operators (`map`, `filter`, `scan`, `debounce`) and combinators (`merge`, `combine`)

## Documentation

- <https://noshiro-pf.github.io/synstate/>

## Packages

- [synstate](packages/synstate) (Core Library)
- [synstate-react-hooks](packages/synstate-react-hooks) (React Integration)
- [synstate-preact-hooks](packages/synstate-preact-hooks) (Preact Integration)

## For developers

### Local Setup

```sh
gh repo clone noshiro-pf/synstate
git submodule update --init --recursive
pnpm i
pnpm run ws:build # Build all packages
```

## License

This project is licensed under the [Apache License 2.0](./LICENSE).
