import { Result } from 'ts-data-forge';
import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Transforms the success value (`Ok`) of a `Result` type emitted by the source.
 * If the value is `Ok`, the mapping function is applied; if `Err`, it remains unchanged.
 *
 * @template R - The Result type from the source
 * @template S2 - The type of the mapped success value
 * @param mapFn - A function to transform the Ok value
 * @returns An operator that maps the Ok side of Result emissions
 */
export const mapResultOk = <R extends UnknownResult, S2>(
  mapFn: (x: Result.UnwrapOk<R>) => S2,
): KeepInitialValueOperator<R, Result<S2, Result.UnwrapErr<R>>> =>
  map((a) => Result.map(a, mapFn));
