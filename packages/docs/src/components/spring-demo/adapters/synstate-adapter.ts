import { combine, map, scan, source, type Observable } from 'synstate';
import {
  type Point,
  type SpringAdapter,
  type Subscription,
} from '../types.js';

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 400;

const LERP_FACTOR = 0.3;

const lerp = (current: Point, target: Point, factor: number): Point => ({
  x: current.x + (target.x - current.x) * factor,
  y: current.y + (target.y - current.y) * factor,
});

const springOperator = (startPos: Point) =>
  scan(
    (acc: Point, target: Point) => lerp(acc, target, LERP_FACTOR),
    startPos,
  );

export const createSynStateSpringAdapter = (): SpringAdapter => {
  let mut_mousePos: ReturnType<typeof source<Point>> | undefined;

  let mut_subscription: Subscription | undefined;

  return {
    name: 'SynState',
    setup: (chainDepth, { onEmit }) => {
      const startPos: Point = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

      mut_mousePos = source<Point>(startPos);

      // Build deep scan chain: each stage follows the previous
      const head = mut_mousePos;
      const mut_stages: Observable<Point>[] = [];

      let mut_prev: Observable<Point> = head;

      for (let mut_i = 0; mut_i < chainDepth; mut_i++) {
        mut_prev = mut_prev.pipe(springOperator(startPos));

        mut_stages.push(mut_prev);
      }

      if (mut_stages.length === 0) {
        // No chain depth — just emit the head
        mut_subscription = head
          .pipe(map((pos) => [pos]))
          .subscribe(onEmit);
      } else {
        // Combine head + all stages into a single Point[]
        const allPoints = combine([head, ...mut_stages] as const).pipe(
          map((points) => [...points]),
        );

        mut_subscription = allPoints.subscribe(onEmit);
      }
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
