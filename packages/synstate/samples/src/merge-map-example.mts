import { mergeMap, source } from 'synstate';

if (import.meta.vitest !== undefined) {
  test(
    mergeMap,
    async () => {
      // embed-sample-code-ignore-above

      //  Timeline:
      //
      //  ids$          1               2               3
      //  requests      fetch(1)        fetch(2)        fetch(3)
      //  responses               -> result1      -> result2  -> result3
      //  mergeMapped                result1         result2     result3
      //                (parallel)      (parallel)      (parallel)
      //
      //  Explanation:
      //  - mergeMap runs all inner observables in parallel
      //  - Results are emitted as they arrive (may be out of order)
      //  - Does NOT cancel previous requests
      //  - All requests run concurrently and all results are emitted

      const ids$ = source<number>();

      const users$ = ids$.pipe(
        mergeMap((id) => {
          const result$ = source<{ id: number }>();

          setTimeout(() => {
            result$.next({ id });

            result$.complete();
          }, Math.random() * 100);

          return result$;
        }),
      );

      const valueHistory: { id: number }[] = [];

      users$.subscribe((value) => {
        valueHistory.push(value);
      });

      ids$.next(1);

      ids$.next(2);

      ids$.next(3);

      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });

      assert.deepStrictEqual(
        new Set(valueHistory.map((u) => u.id)),
        new Set([1, 2, 3]),
      );

      // embed-sample-code-ignore-below
    },
    10000,
  );
}
