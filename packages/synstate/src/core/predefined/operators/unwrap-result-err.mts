import { Result } from 'ts-data-forge';
import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Unwraps the error value from a `Result`, converting `Err(error)` to `error` and `Ok` to `undefined`.
 *
 * @template R - The Result type from the source
 * @returns An operator that unwraps the Err side of Result emissions
 */
export const unwrapResultErr = <
  R extends UnknownResult,
>(): KeepInitialValueOperator<R, Result.UnwrapErr<R> | undefined> =>
  map(Result.unwrapErr as Fn<R, Result.UnwrapErr<R> | undefined>);
