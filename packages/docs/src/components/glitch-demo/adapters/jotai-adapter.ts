/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { atom, createStore } from 'jotai';
import { type Adapter, type Point } from '../types.js';

export const createJotaiAdapter = (): Adapter => {
  let mut_store: ReturnType<typeof createStore> | undefined;

  let mut_mousePosAtom: ReturnType<typeof atom<Point>> | undefined;

  let mut_unsubscribe: (() => void) | undefined;

  return {
    name: 'Jotai',
    setup: (startPos, { onEmit }) => {
      mut_store = createStore();

      mut_mousePosAtom = atom<Point>(startPos);

      const topLeftAtom = atom((get) => {
        const pos = get(mut_mousePosAtom!);

        return {
          x: Math.min(startPos.x, pos.x),
          y: Math.min(startPos.y, pos.y),
        };
      });

      const sizeAtom = atom((get) => {
        const pos = get(mut_mousePosAtom!);

        return {
          width: Math.abs(pos.x - startPos.x),
          height: Math.abs(pos.y - startPos.y),
        };
      });

      const rectAtom = atom((get) => ({
        ...get(topLeftAtom),
        ...get(sizeAtom),
      }));

      // Jotai requires an initial read to set up subscriptions
      mut_store.get(rectAtom);

      mut_unsubscribe = mut_store.sub(rectAtom, () => {
        onEmit(mut_store!.get(rectAtom));
      });
    },
    onMouseMove: (pos) => {
      mut_store?.set(mut_mousePosAtom!, pos);
    },
    cleanup: () => {
      mut_unsubscribe?.();

      mut_unsubscribe = undefined;

      mut_store = undefined;

      mut_mousePosAtom = undefined;
    },
  };
};
