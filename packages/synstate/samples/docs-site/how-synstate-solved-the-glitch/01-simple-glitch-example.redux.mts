/* eslint-disable unicorn/consistent-function-scoping */
// embed-sample-code-ignore-above
import { configureStore, createSelector, createSlice } from '@reduxjs/toolkit';

/* embed-sample-code-ignore-this-line */ if (import.meta.vitest !== undefined) {
  /* embed-sample-code-ignore-this-line */ test('simple-glitch-example (Redux)', async () => {
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

    // embed-sample-code-ignore-below
  });
}
