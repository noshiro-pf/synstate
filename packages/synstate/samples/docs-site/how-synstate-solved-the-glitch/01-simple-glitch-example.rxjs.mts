import {
  combineLatest,
  interval,
  lastValueFrom,
  map,
  take,
  toArray,
} from 'rxjs';

/* embed-sample-code-ignore-this-line */ if (import.meta.vitest !== undefined) {
  /* embed-sample-code-ignore-this-line */ test('simple-glitch-example (RxJS)', async () => {
    const counterObservable = interval(100);
    // 0, 1, 2, 3, ...

    const multipliedCounter = counterObservable.pipe(
      map((count) => count * 1000),
    );
    // 0, 1000, 2000, 3000, ...

    const sum = combineLatest([multipliedCounter, counterObservable]).pipe(
      map(([a, b]) => a + b),
    );
    // 0, 1000, 1001, 2001, 2002, 3002, 3003, ...

    const result = await lastValueFrom(sum.pipe(take(7), toArray()));

    assert.deepStrictEqual(result, [0, 1000, 1001, 2001, 2002, 3002, 3003]);

    // embed-sample-code-ignore-below

    // In RxJS, when counterObservable emits a new value,
    // multipliedCounter (which subscribes to counterObservable) updates first,
    // but combineLatest still holds the old counterObservable value at that point.
    // This causes glitches — inconsistent intermediate states:
    //
    //   counter: 0 → multiplied: 0,    sum: 0+0 = 0       ✓
    //   counter: 1 → multiplied: 1000, sum: 1000+0 = 1000 ✗ glitch (counter still 0)
    //                                  sum: 1000+1 = 1001 ✓
    //   counter: 2 → multiplied: 2000, sum: 2000+1 = 2001 ✗ glitch (counter still 1)
    //                                  sum: 2000+2 = 2002 ✓
    //   counter: 3 → multiplied: 3000, sum: 3000+2 = 3002 ✗ glitch (counter still 2)
    //                                  sum: 3000+3 = 3003 ✓
  });
}
