import {
  BehaviorSubject,
  combineLatest,
  map,
  scan,
  type Observable,
  type Subscription,
} from 'rxjs';
import { Arr, range } from 'ts-data-forge';
import { type Point, type SpringAdapter } from '../types.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './synstate-adapter.js';

// LERP = "Linear Interpolation"
const LERP_FACTOR = 0.3;

const lerp = (current: Point, target: Point, factor: number): Point => ({
  x: current.x + (target.x - current.x) * factor,
  y: current.y + (target.y - current.y) * factor,
});

export const createRxJSSpringAdapter = (): SpringAdapter => {
  let mut_mousePos$: BehaviorSubject<Point> | undefined;

  let mut_subscription: Subscription | undefined;

  return {
    name: 'RxJS',
    setup: (chainDepth, { onEmit }) => {
      const startPos: Point = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

      mut_mousePos$ = new BehaviorSubject<Point>(startPos);

      // Build deep scan chain
      const mut_stages: Observable<Point>[] = [];

      let mut_prev: Observable<Point> = mut_mousePos$;

      for (const _ of range(0, chainDepth)) {
        const stage = mut_prev.pipe(
          scan(
            (acc: Point, target: Point) => lerp(acc, target, LERP_FACTOR),
            startPos,
          ),
        );

        mut_stages.push(stage);

        mut_prev = stage;
      }

      if (Arr.isArrayOfLength(mut_stages, 0)) {
        mut_subscription = mut_mousePos$
          .pipe(map((pos) => [pos]))
          .subscribe(onEmit);
      } else {
        const allPoints$ = combineLatest([mut_mousePos$, ...mut_stages]).pipe(
          map((points) => points),
        );

        mut_subscription = allPoints$.subscribe(onEmit);
      }
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
