import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Extracts a property value from each emitted object by key.
 * Equivalent to `map(value => value[key])`.
 *
 * @template A - The type of the emitted object
 * @template K - The key to extract
 * @param key - The property key to pluck
 * @returns An operator that emits the property value
 */
export const pluck = <A, K extends keyof A>(
  key: K,
): KeepInitialValueOperator<A, A[K]> => map((a) => a[key]);

/**
 * Alias for `pluck`.
 * @see pluck
 */
export const getKey = pluck;
