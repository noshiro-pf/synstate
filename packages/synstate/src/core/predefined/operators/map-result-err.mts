import { Result } from 'ts-data-forge';
import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Transforms the error value (`Err`) of a `Result` type emitted by the source.
 * If the value is `Err`, the mapping function is applied; if `Ok`, it remains unchanged.
 *
 * @template R - The Result type from the source
 * @template E2 - The type of the mapped error value
 * @param mapFn - A function to transform the Err value
 * @returns An operator that maps the Err side of Result emissions
 */
export const mapResultErr = <R extends UnknownResult, E2>(
  mapFn: (x: Result.UnwrapErr<R>) => E2,
): KeepInitialValueOperator<R, Result<Result.UnwrapOk<R>, E2>> =>
  map((a) => Result.mapErr(a, mapFn));
