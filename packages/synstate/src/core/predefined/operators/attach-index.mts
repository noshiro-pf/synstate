import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Attaches a sequential index to each emitted value, producing `[index, value]` tuples.
 * Index starts at 0 and increments with each emission.
 *
 * @template A - The type of values from the source
 * @returns An operator that emits `[index, value]` tuples
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
