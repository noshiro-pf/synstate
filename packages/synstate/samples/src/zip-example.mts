import { createState, zip } from 'synstate';

if (import.meta.vitest !== undefined) {
  test(zip, () => {
    // embed-sample-code-ignore-above

    //  Timeline:
    //
    //  letters$  'a'       'b'       'c'
    //  numbers$  1         2         3
    //  zipped$   ['a',1]   ['b',2]   ['c',3]
    //
    //  Explanation:
    //  - zip pairs values by their index from multiple sources
    //  - Waits for all sources to emit at the same index
    //  - Completes when any source completes

    const [letters$, setLetter] = createState<string>('a');

    const [numbers$, setNumber] = createState<number>(1);

    const zipped$ = zip([letters$, numbers$]);

    const valueHistory: (readonly [string, number])[] = [];

    zipped$.subscribe(([letter, num]) => {
      valueHistory.push([letter, num]);
    });

    for (const letter of ['b', 'c']) {
      setLetter(letter);
    }

    for (const num of [2, 3]) {
      setNumber(num);
    }

    assert.deepStrictEqual(valueHistory, [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    // embed-sample-code-ignore-below
  });
}
