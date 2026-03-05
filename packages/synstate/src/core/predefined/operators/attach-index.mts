import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Attaches a sequential index to each emitted value, producing `[index, value]` tuples.
 * Index starts at 0 and increments with each emission.
 *
 * @template A - The type of values from the source
 * @returns An operator that emits `[index, value]` tuples
 *
 * @example
 * ```ts
 * //  Timeline:
 * //
 * //  letter$    "a"      "b"      "c"
 * //  indexed$   [0,"a"]  [1,"b"]  [2,"c"]
 * //
 * //  Explanation:
 * //  - attachIndex attaches a sequential index to each emitted value
 * //  - Produces [index, value] tuples
 * //  - Index starts at 0 and increments with each emission
 *
 * const letter$ = source<string>();
 *
 * const indexed$ = letter$.pipe(attachIndex());
 *
 * const valueHistory: (readonly [number, string])[] = [];
 *
 * indexed$.subscribe(([i, letter]) => {
 *   valueHistory.push([i, letter]);
 * });
 *
 * letter$.next('a');
 *
 * assert.deepStrictEqual(valueHistory, [[0, 'a']]);
 *
 * letter$.next('b');
 *
 * assert.deepStrictEqual(valueHistory, [
 *   [0, 'a'],
 *   [1, 'b'],
 * ]);
 *
 * letter$.next('c');
 *
 * assert.deepStrictEqual(valueHistory, [
 *   [0, 'a'],
 *   [1, 'b'],
 *   [2, 'c'],
 * ]);
 * ```
 */
export const withIndex = <A,>(): KeepInitialValueOperator<
  A,
  readonly [SafeUint | -1, A]
> => map((a, i) => [i, a] as const);

/**
 * Alias for `withIndex`.
 * @see withIndex
 */
export const attachIndex = withIndex;
