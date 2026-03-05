import { Result } from 'ts-data-forge';
import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Unwraps the success value from a `Result`, converting `Ok(value)` to `value` and `Err` to `undefined`.
 *
 * @template R - The Result type from the source
 * @returns An operator that unwraps the Ok side of Result emissions
 */
export const unwrapResultOk = <
  R extends UnknownResult,
>(): KeepInitialValueOperator<R, Result.UnwrapOk<R> | undefined> =>
  // eslint-disable-next-line total-functions/no-unsafe-type-assertion
  map(Result.unwrapOk as Fn<R, Result.UnwrapOk<R> | undefined>);
