import { source, throttle } from 'synstate';

if (import.meta.vitest !== undefined) {
  test(throttle, async () => {
    // embed-sample-code-ignore-above

    //  Timeline (1000ms throttle):
    //
    //  Time(ms)   0    100   200   300   ...   1000  1100  1200  ...   2000  2100
    //  scroll$    e1   e2    e3    e4          e5    e6    e7          e8    e9
    //  throttled$ e1                           e5                      e8
    //             |-------1000ms------>        |------1000ms------>    |------1000ms------>
    //
    //  Explanation:
    //  - throttle emits the first value immediately, then ignores subsequent values
    //    for the specified duration (1000ms)
    //  - At 0ms: e1 is emitted immediately
    //  - At 100-300ms: e2, e3, e4 are ignored (within 1000ms window)
    //  - At 1000ms: e5 is emitted (1000ms has passed since e1)
    //  - At 1100-1200ms: e6, e7 are ignored
    //  - At 2000ms: e8 is emitted (1000ms has passed since e5)

    const scroll$ = source<number>();

    const throttled$ = scroll$.pipe(throttle(200));

    const valueHistory: number[] = [];

    throttled$.subscribe((value) => {
      valueHistory.push(value);
    });

    scroll$.next(1);

    assert.deepStrictEqual(valueHistory, [1]);

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    scroll$.next(2);

    scroll$.next(3);

    assert.deepStrictEqual(valueHistory, [1]);

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    scroll$.next(4);

    assert.deepStrictEqual(valueHistory, [1, 4]);

    // embed-sample-code-ignore-below
  });
}
