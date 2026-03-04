---
prev: false
next: false
title: API Reference
sidebar:
    order: 1
---

## State Management

SynState provides simple, intuitive APIs for managing application state:

- **`createState`**: Create state with `InitializedObservable` and setter
- **`createReducer`**: Create state by reducer and initial value
- **`createBooleanState`**: Specialized state for boolean values

## Event System

Built-in event emitter for event-driven patterns:

- **`createValueEmitter`**: Create type-safe event emitters
- **`createEventEmitter`**: Create event emitters without payload

## Observable APIs

For complex scenarios, SynState provides observable-based APIs:

### Creation Functions

- `source<T>()`: Create a new observable source (almost equivalent to RxJS `subject`)
- `fromPromise(promise)`: Create observable from promise
- `fromSubscribable()`: Create observable from any subscribable object
- `counter(ms)`: Emit values at intervals (almost equivalent to RxJS `interval`)
- `timer(delay)`: Emit after delay

### Operators

#### map variants

- `map(fn)`: Transform values
- `mapTo(value)`: Map all values to a constant
- `getKey(key)`: Extract property value from objects (alias: `pluck`)
- `attachIndex()`: Attach index to each value (alias: `withIndex`)

#### Result/Optional

- `mapOptional(fn)`: Map over Optional values
- `mapResultOk(fn)`: Map over Result ok values
- `mapResultErr(fn)`: Map over Result error values
- `unwrapOptional()`: Unwrap Optional values to undefined
- `unwrapResultOk()`: Unwrap Result ok values to undefined
- `unwrapResultErr()`: Unwrap Result error values to undefined

#### Flat map

- `mergeMap(fn)`: Map to observables and merge all (runs in parallel) (alias: `flatMap`)
- `switchMap(fn)`: Map to observables and switch to latest (cancels previous)

#### Filtering

- `filter(predicate)`: Filter values
- `skipIfNoChange()`: Skip duplicate values (alias: `distinctUntilChanged`)
- `skip(n)`: Skip first n emissions
- `take(n)`: Take first n emissions then complete
- `skipWhile(predicate)`: Skip values while predicate is true
- `takeWhile(predicate)`: Emit values while predicate is true, then complete
- `skipUntil(notifier)`: Skip values until notifier emits
- `takeUntil(notifier)`: Complete on notifier emission

#### Time series processing

- `audit(ms)`: Emit the last value after specified time window (almost equivalent to RxJS `auditTime`)
- `debounce(ms)`: Debounce emissions (almost equivalent to RxJS `debounceTime`)
- `throttle(ms)`: Throttle emissions (almost equivalent to RxJS `throttleTime`)

#### Others

- `pairwise()`: Emit previous and current values as pairs
- `scan(reducer, seed)`: Accumulate values
- `withBuffered(observable)`: Buffer values from observable and emit with parent (alias: `withBufferedFrom`)
- `withCurrentValueFrom(observable)`: Sample current value from another observable (alias: `withLatestFrom`)
- `withInitialValue(value)`: Provide an initial value for uninitialized observable

### Combination

- `combine(observables)`: Combine latest values from multiple sources (alias: `combineLatest`)
- `merge(observables)`: Merge multiple streams
- `zip(observables)`: Pair values by index

### Utilities

- `isChildObservable(obs)`: Check if observable is a child observable
- `isManagerObservable(obs)`: Check if observable is a manager observable
- `isRootObservable(obs)`: Check if observable is a root observable
