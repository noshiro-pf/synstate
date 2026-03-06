import { collectToArray, combine, counter, map, take } from 'synstate';

/* embed-sample-code-ignore-this-line */ if (import.meta.vitest !== undefined) {
  /* embed-sample-code-ignore-this-line */ test('simple-glitch-example', async () => {
    const counterObservable = counter(1000 /* ms */);
    // 0, 1, 2, 3, ...

    const multipliedCounter = counterObservable.pipe(
      map((count) => count * 1000),
    );
    // 0, 1000, 2000, 3000, ...

    const sum = combine([multipliedCounter, counterObservable]).pipe(
      map(([a, b]) => a + b),
    );
    // 0, 1001, 2002, 3003, ...

    const resultPromise = collectToArray(sum.pipe(take(5)));

    counterObservable.start();

    const result = await resultPromise;

    assert.deepStrictEqual(result, [0, 1001, 2002, 3003, 4004]);

    // embed-sample-code-ignore-below
  });
}
