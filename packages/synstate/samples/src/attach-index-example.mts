import { attachIndex, source } from 'synstate';

if (import.meta.vitest !== undefined) {
  test(attachIndex, () => {
    // embed-sample-code-ignore-above

    //  Timeline:
    //
    //  letter$    "a"      "b"      "c"
    //  indexed$   [0,"a"]  [1,"b"]  [2,"c"]
    //
    //  Explanation:
    //  - attachIndex attaches a sequential index to each emitted value
    //  - Produces [index, value] tuples
    //  - Index starts at 0 and increments with each emission

    const letter$ = source<string>();

    const indexed$ = letter$.pipe(attachIndex());

    const valueHistory: (readonly [number, string])[] = [];

    indexed$.subscribe(([i, letter]) => {
      valueHistory.push([i, letter]);
    });

    letter$.next('a');

    assert.deepStrictEqual(valueHistory, [[0, 'a']]);

    letter$.next('b');

    assert.deepStrictEqual(valueHistory, [
      [0, 'a'],
      [1, 'b'],
    ]);

    letter$.next('c');

    assert.deepStrictEqual(valueHistory, [
      [0, 'a'],
      [1, 'b'],
      [2, 'c'],
    ]);

    // embed-sample-code-ignore-below
  });
}
