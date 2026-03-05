import { Optional } from 'ts-data-forge';
import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Transforms the inner value of an `Optional` type emitted by the source.
 * If the value is `Some`, the mapping function is applied; if `None`, it remains `None`.
 *
 * @template O - The Optional type from the source
 * @template B - The type of the mapped inner value
 * @param mapFn - A function to transform the unwrapped value
 * @returns An operator that maps the inner value of Optional emissions
 */
export const mapOptional = <O extends UnknownOptional, B>(
  mapFn: (x: Optional.Unwrap<O>) => B,
): KeepInitialValueOperator<O, Optional<B>> =>
  map((a) => Optional.map(a, mapFn));
