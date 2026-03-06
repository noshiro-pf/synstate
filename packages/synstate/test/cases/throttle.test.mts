import { ISet } from 'ts-data-forge';
import {
  counter,
  filter,
  merge,
  take,
  throttle,
  type Observable,
} from '../../src/index.mjs';
import { getStreamHistoryAsPromise } from '../get-stream-history-as-promise.mjs';
import { testStream } from '../test-stream.mjs';
import { type StreamTestCase } from '../typedef.mjs';

/*
  (tick)   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9

  counter  0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21  22  23
  filtered     1   2   3               7       9   10      12  13          16  17  18  19  20
  throttle     1                       7           10          13          16          19
               |--------->             |---------> |---------> |---------> |---------> |--------->
*/
const createStreams = (
  tick: number,
): Readonly<{
  startSource: () => void;
  counter$: Observable<SafeUint>;
  filtered$: Observable<number>;
  throttle$: Observable<number>;
  merged$: Observable<number>;
}> => {
  const emitValues = ISet.create([
    1, 2, 3, 7, 9, 10, 12, 13, 16, 17, 18, 19, 20,
  ]);

  const counter$ = counter(tick * 2, { startManually: true });

  const counter21$ = counter$.pipe(take(21));

  const filtered$ = counter21$.pipe(filter((n) => emitValues.has(n)));

  const throttle$ = filtered$.pipe(throttle(tick * 5));

  const merged$ = merge([filtered$, throttle$]);

  return {
    startSource: () => {
      counter$.start();
    },
    counter$: counter21$,
    filtered$,
    throttle$,
    merged$,
  };
};

export const throttleTestCases: readonly [
  StreamTestCase<number>,
  StreamTestCase<number>,
] = [
  {
    name: 'throttle case 1',
    expectedOutput: [1, 7, 10, 13, 16, 19],
    run: (tick: number): Promise<readonly number[]> => {
      const { startSource, throttle$ } = createStreams(tick);

      return getStreamHistoryAsPromise(throttle$, startSource);
    },
    preview: (tick: number): void => {
      const { startSource, counter$, filtered$, throttle$ } =
        createStreams(tick);

      counter$.subscribe((a) => {
        console.log('counter     ', a);
      });

      filtered$.subscribe((a) => {
        console.log('filtered    ', a);
      });

      throttle$.subscribe((a) => {
        console.log('throttle', a);
      });

      startSource();
    },
  },
  {
    name: 'throttle case 2',
    expectedOutput: [1, 2, 3, 7, 9, 10, 12, 13, 16, 17, 18, 19, 20],
    run: (tick: number): Promise<readonly number[]> => {
      const { startSource, merged$ } = createStreams(tick);

      return getStreamHistoryAsPromise(merged$, startSource);
    },
    preview: (tick: number): void => {
      const { startSource, filtered$, throttle$, merged$ } =
        createStreams(tick);

      filtered$.subscribe((a) => {
        console.log('filtered    ', a);
      });

      throttle$.subscribe((a) => {
        console.log('throttle', a);
      });

      merged$.subscribe((a) => {
        console.log('merged      ', a);
      });

      startSource();
    },
  },
];

for (const c of throttleTestCases) {
  testStream(c);
}
