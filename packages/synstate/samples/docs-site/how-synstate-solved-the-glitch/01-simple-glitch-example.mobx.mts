import { computed, observable, reaction, runInAction } from 'mobx';

/* embed-sample-code-ignore-this-line */ if (import.meta.vitest !== undefined) {
  /* embed-sample-code-ignore-this-line */ test('simple-glitch-example (MobX)', async () => {
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
    // embed-sample-code-ignore-below
  });
}
