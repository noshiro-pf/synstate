import { useCallback, useMemo, useRef, useState } from 'react';
import {
  createJotaiAdapter,
  createRxJSAdapter,
  createSynStateAdapter,
} from './adapters/index.js';
import { RectCanvas } from './rect-canvas.js';
import { type Point } from './types.js';

type DragState = Readonly<{
  isDragging: boolean;
  startPos: Point | null;
  currentPos: Point | null;
}>;

const INITIAL_DRAG_STATE: DragState = {
  isDragging: false,
  startPos: null,
  currentPos: null,
};

export const GlitchDemo: React.FC = () => {
  const adapters = useMemo(
    () => [createSynStateAdapter(), createRxJSAdapter(), createJotaiAdapter()],
    [],
  );

  const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);

  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const getRelativePos = useCallback((e: React.MouseEvent): Point => {
    const container = containerRef.current;

    if (container == null) return { x: 0, y: 0 };

    // const rect = container.getBoundingClientRect();

    // Use the first canvas's position as coordinate origin
    const firstCanvas = container.querySelector('canvas');

    if (firstCanvas == null) return { x: 0, y: 0 };

    const canvasRect = firstCanvas.getBoundingClientRect();

    return {
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.MouseEvent) => {
      e.preventDefault();

      const pos = getRelativePos(e);

      setDragState({
        isDragging: true,
        startPos: pos,
        currentPos: pos,
      });
    },
    [getRelativePos],
  );

  const handleMouseMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.MouseEvent) => {
      setDragState((prev) => {
        if (!prev.isDragging) return prev;

        return { ...prev, currentPos: getRelativePos(e) };
      });
    },
    [getRelativePos],
  );

  const handleMouseUp = useCallback(() => {
    setDragState((prev) => {
      if (!prev.isDragging) return prev;

      return { ...prev, isDragging: false };
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDragState((prev) => {
      if (!prev.isDragging) return prev;

      return { ...prev, isDragging: false };
    });
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          cursor: dragState.isDragging ? 'crosshair' : 'default',
          userSelect: 'none',
          padding: '16px 0',
        }}
      >
        {adapters.map((adapter) => (
          <RectCanvas
            key={adapter.name}
            adapter={adapter}
            dragState={dragState}
          />
        ))}
      </div>
      <p
        style={{
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--sl-color-gray-3, #6b7280)',
          marginTop: '8px',
        }}
      >
        Click and drag anywhere above to draw rectangles. All three libraries
        receive the same mouse coordinates simultaneously.
      </p>
    </div>
  );
};
