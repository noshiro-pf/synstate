import { takeWhile } from '../../operators/index.mjs';
import { type DropInitialValueOperator } from '../../types/index.mjs';

/**
 * Takes only the first `n` emissions from the source observable, then completes.
 *
 * @template A - The type of values from the source
 * @param n - The number of values to take
 * @returns An operator that takes the first n emissions
 */
export const take = <A,>(
  n: PositiveSafeIntWithSmallInt,
): DropInitialValueOperator<A, A> => takeWhile((_, index) => index + 1 <= n);
