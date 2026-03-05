import { Optional } from 'ts-data-forge';
import { map } from '../../operators/index.mjs';
import { type KeepInitialValueOperator } from '../../types/index.mjs';

/**
 * Unwraps `Optional` values, converting `Some(value)` to `value` and `None` to `undefined`.
 *
 * @template O - The Optional type from the source
 * @returns An operator that unwraps Optional emissions
 */
export const unwrapOptional = <
  O extends UnknownOptional,
>(): KeepInitialValueOperator<O, Optional.Unwrap<O> | undefined> =>
  // eslint-disable-next-line total-functions/no-unsafe-type-assertion
  map(Optional.unwrap as Fn<O, Optional.Unwrap<O> | undefined>);
