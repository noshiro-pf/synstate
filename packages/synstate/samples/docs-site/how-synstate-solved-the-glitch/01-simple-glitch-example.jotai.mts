import { atom, createStore } from 'jotai/vanilla';

/* embed-sample-code-ignore-this-line */ if (import.meta.vitest !== undefined) {
  /* embed-sample-code-ignore-this-line */ test('simple-glitch-example (Jotai)', async () => {
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

    // embed-sample-code-ignore-below
  });
}
