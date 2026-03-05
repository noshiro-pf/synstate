/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { atom, createStore } from 'jotai';
import { range } from 'ts-data-forge';
import { type Point, type SpringAdapter } from '../types.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './synstate-adapter.js';

const LERP_FACTOR = 0.3;

const lerp = (current: Point, target: Point, factor: number): Point => ({
  x: current.x + (target.x - current.x) * factor,
  y: current.y + (target.y - current.y) * factor,
});

export const createJotaiSpringAdapter = (): SpringAdapter => {
  let mut_store: ReturnType<typeof createStore> | undefined;

  let mut_mousePosAtom: ReturnType<typeof atom<Point>> | undefined;

  let mut_stageAtoms: ReturnType<typeof atom<Point>>[] | undefined;

  let mut_unsubscribe: (() => void) | undefined;

  return {
    name: 'Jotai',
    setup: (chainDepth, { onEmit }) => {
      const startPos: Point = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

      mut_store = createStore();

      mut_mousePosAtom = atom<Point>(startPos);

      // Create writable atoms for each stage's position
      mut_stageAtoms = [];

      for (const _ of range(0, chainDepth)) {
        mut_stageAtoms.push(atom<Point>(startPos));
      }

      // Derived atom that reads head + all stages
      const stageAtomsCopy = mut_stageAtoms;

      const mousePosAtomCopy = mut_mousePosAtom;

      const allPointsAtom = atom((get) => {
        const head = get(mousePosAtomCopy);

        return [head, ...stageAtomsCopy.map((a) => get(a))];
      });

      // Initial read to establish subscription
      mut_store.get(allPointsAtom);

      mut_unsubscribe = mut_store.sub(allPointsAtom, () => {
        onEmit(mut_store!.get(allPointsAtom));
      });
    },
    onMouseMove: (pos) => {
      if (
        mut_store == null ||
        mut_mousePosAtom == null ||
        mut_stageAtoms == null
      ) {
        return;
      }

      // Update head
      mut_store.set(mut_mousePosAtom, pos);

      // Propagate through spring chain: each stage lerps toward the previous
      let mut_target = pos;

      for (const stageAtom of mut_stageAtoms) {
        const current = mut_store.get(stageAtom);

        const next = lerp(current, mut_target, LERP_FACTOR);

        mut_store.set(stageAtom, next);

        mut_target = next;
      }
    },
    cleanup: () => {
      mut_unsubscribe?.();

      mut_unsubscribe = undefined;

      mut_store = undefined;

      mut_mousePosAtom = undefined;

      mut_stageAtoms = undefined;
    },
  };
};
