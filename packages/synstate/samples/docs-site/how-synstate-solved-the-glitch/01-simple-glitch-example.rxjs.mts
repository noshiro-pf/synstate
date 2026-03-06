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

    const sum = combineLatest([counterObservable, multipliedCounter]).pipe(
      map(([a, b]) => a + b),
    );
    // 0, 1, 1001, 1002, 2002, 2003, 3003, ...

    const result = await lastValueFrom(sum.pipe(take(7), toArray()));

    assert.deepStrictEqual(result, [0, 1, 1001, 1002, 2002, 2003, 3003]);

    // embed-sample-code-ignore-below

    // In RxJS, when counterObservable emits a new value,
    // combineLatest (which subscribes to counterObservable first) updates
    // the counter slot before multipliedCounter has recalculated.
    // This causes glitches — inconsistent intermediate states:
    //
    //   counter: 0 → multiplied: 0,    sum: 0+0 = 0       ✓
    //   counter: 1 → counter updates,  sum: 1+0 = 1       ✗ glitch (multiplied still 0)
    //                multiplied: 1000, sum: 1+1000 = 1001 ✓
    //   counter: 2 → counter updates,  sum: 2+1000 = 1002 ✗ glitch (multiplied still 1000)
    //                multiplied: 2000, sum: 2+2000 = 2002 ✓
    //   counter: 3 → counter updates,  sum: 3+2000 = 2003 ✗ glitch (multiplied still 2000)
    //                multiplied: 3000, sum: 3+3000 = 3003 ✓
  });
}
