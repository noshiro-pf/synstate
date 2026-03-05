/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { atom, createStore } from 'jotai';
import { type Adapter, type Point } from '../types.js';

export const createJotaiAdapter = (): Adapter => {
  let mut_store: ReturnType<typeof createStore> | undefined;

  let mut_mousePosAtom: ReturnType<typeof atom<Point>> | undefined;

  let mut_unsubscribe: (() => void) | undefined;

  return {
    name: 'Jotai',
    setup: ({ onEmit }) => {
      mut_store = createStore();

      mut_mousePosAtom = atom<Point>({ x: -1, y: -1 });

      const derivedXAtom = atom((get) => get(mut_mousePosAtom!).x);

      const derivedYAtom = atom((get) => get(mut_mousePosAtom!).y);

      const combinedAtom = atom((get) => ({
        x: get(derivedXAtom),
        y: get(derivedYAtom),
      }));

      // Jotai requires an initial read to set up subscriptions
      mut_store.get(combinedAtom);

      mut_unsubscribe = mut_store.sub(combinedAtom, () => {
        onEmit(mut_store!.get(combinedAtom));
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
