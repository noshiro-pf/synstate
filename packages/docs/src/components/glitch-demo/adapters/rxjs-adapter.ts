import { BehaviorSubject, combineLatest, map, type Subscription } from 'rxjs';
import { type Adapter, type Point } from '../types.js';

export const createRxJSAdapter = (): Adapter => {
  let mut_mousePos$: BehaviorSubject<Point> | undefined;

  let mut_subscription: Subscription | undefined;

  return {
    name: 'RxJS',
    setup: (startPos, { onEmit }) => {
      mut_mousePos$ = new BehaviorSubject<Point>(startPos);

      const topLeft$ = mut_mousePos$.pipe(
        map((pos) => ({
          x: Math.min(startPos.x, pos.x),
          y: Math.min(startPos.y, pos.y),
        })),
      );

      const size$ = mut_mousePos$.pipe(
        map((pos) => ({
          width: Math.abs(pos.x - startPos.x),
          height: Math.abs(pos.y - startPos.y),
        })),
      );

      const rect$ = combineLatest([topLeft$, size$]).pipe(
        map(([tl, sz]) => ({ ...tl, ...sz })),
      );

      mut_subscription = rect$.subscribe(onEmit);
    },
    onMouseMove: (pos) => {
      mut_mousePos$?.next(pos);
    },
    cleanup: () => {
      mut_subscription?.unsubscribe();

      mut_subscription = undefined;

      mut_mousePos$?.complete();

      mut_mousePos$ = undefined;
    },
  };
};
