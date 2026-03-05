import { combine, map, source } from 'synstate';
import { type Adapter, type Point, type Subscription } from '../types.js';

export const createSynStateAdapter = (): Adapter => {
  let mut_mousePos: ReturnType<typeof source<Point>> | undefined;

  let mut_subscription: Subscription | undefined;

  return {
    name: 'SynState',
    setup: (startPos, { onEmit }) => {
      mut_mousePos = source<Point>(startPos);

      const topLeft = mut_mousePos.pipe(
        map((pos) => ({
          x: Math.min(startPos.x, pos.x),
          y: Math.min(startPos.y, pos.y),
        })),
      );

      const size = mut_mousePos.pipe(
        map((pos) => ({
          width: Math.abs(pos.x - startPos.x),
          height: Math.abs(pos.y - startPos.y),
        })),
      );

      const rect = combine([topLeft, size]).pipe(
        map(([tl, sz]) => ({ ...tl, ...sz })),
      );

      mut_subscription = rect.subscribe(onEmit);
    },
    onMouseMove: (pos) => {
      mut_mousePos?.next(pos);
    },
    cleanup: () => {
      mut_subscription?.unsubscribe();

      mut_subscription = undefined;

      mut_mousePos = undefined;
    },
  };
};
