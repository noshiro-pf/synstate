import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Maps all emitted values to a constant value, ignoring the source values.
 * Equivalent to `map(() => value)`.
 *
 * @template A - The type of values from the source
 * @template B - The type of the constant value
 * @param value - The constant value to emit
 * @returns An operator that always emits the given constant
 */
export const mapTo = <A, B>(value: B): KeepInitialValueOperator<A, B> =>
  map(() => value);
