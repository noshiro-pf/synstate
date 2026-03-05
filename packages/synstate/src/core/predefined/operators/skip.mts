import { PositiveSafeInt } from 'ts-data-forge';
import { skipWhile } from '../../operators/index.mjs';
import { type DropInitialValueOperator } from '../../types/index.mjs';

/**
 * Skips the first `n` emissions from the source observable.
 * After `n` values are skipped, all subsequent values pass through.
 *
 * @template A - The type of values from the source
 * @param n - The number of values to skip
 * @returns An operator that skips the first n emissions
 */
export const skip = <A,>(
  n: PositiveSafeIntWithSmallInt,
): DropInitialValueOperator<A, A> =>
  !PositiveSafeInt.is(n) ? idFn : skipWhile((_, index) => index + 1 <= n);

const idFn = <T,>(value: T): T => value;
