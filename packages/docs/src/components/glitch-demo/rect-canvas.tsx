import { useCallback, useEffect, useRef, useState } from 'react';
import { type Adapter, type Point, type RectData } from './types.js';

type Stats = Readonly<{
  totalUpdates: number;
  glitches: number;
  totalMicroseconds: number;
}>;

type Props = Readonly<{
  adapter: Adapter;
  dragState: {
    isDragging: boolean;
    startPos: Point | null;
    currentPos: Point | null;
  };
}>;

const CANVAS_WIDTH = 300;

const CANVAS_HEIGHT = 220;

const COLOR_NORMAL = 'rgba(59, 130, 246, 0.15)';

const COLOR_GLITCH = 'rgba(239, 68, 68, 0.15)';

const computeExpectedRect = (startPos: Point, currentPos: Point): RectData => ({
  x: Math.min(startPos.x, currentPos.x),
  y: Math.min(startPos.y, currentPos.y),
  width: Math.abs(currentPos.x - startPos.x),
  height: Math.abs(currentPos.y - startPos.y),
});

const rectsMatch = (a: RectData, b: RectData): boolean =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

export const RectCanvas: React.FC<Props> = ({ adapter, dragState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const latestPosRef = useRef<Point | null>(null);

  const startPosRef = useRef<Point | null>(null);

  const [stats, setStats] = useState<Stats>({
    totalUpdates: 0,
    glitches: 0,
    totalMicroseconds: 0,
  });

  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx == null) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);

  // Handle drag lifecycle
  useEffect(() => {
    if (dragState.isDragging && dragState.startPos != null) {
      // Drag started
      startPosRef.current = dragState.startPos;

      latestPosRef.current = dragState.startPos;

      clearCanvas();

      setStats({ totalUpdates: 0, glitches: 0, totalMicroseconds: 0 });

      adapter.setup(dragState.startPos, {
        onEmit: (rect) => {
          const t0 = performance.now();

          const startPos = startPosRef.current;

          const currentPos = latestPosRef.current;

          let mut_isGlitch = false;

          if (startPos != null && currentPos != null) {
            const expected = computeExpectedRect(startPos, currentPos);

            mut_isGlitch = !rectsMatch(rect, expected);
          }

          const mut_ctx = canvasRef.current?.getContext('2d');

          if (mut_ctx != null) {
            mut_ctx.fillStyle = mut_isGlitch ? COLOR_GLITCH : COLOR_NORMAL;

            mut_ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
          }

          const elapsed = (performance.now() - t0) * 1000; // to microseconds

          setStats((prev) => ({
            totalUpdates: prev.totalUpdates + 1,
            glitches: prev.glitches + (mut_isGlitch ? 1 : 0),
            totalMicroseconds: prev.totalMicroseconds + elapsed,
          }));
        },
      });
    }

    if (!dragState.isDragging) {
      adapter.cleanup();
    }

    return () => {
      // cleanup on unmount
    };
  }, [dragState.isDragging, dragState.startPos]);

  // Handle mouse move
  useEffect(() => {
    if (dragState.isDragging && dragState.currentPos != null) {
      latestPosRef.current = dragState.currentPos;

      adapter.onMouseMove(dragState.currentPos);
    }
  }, [adapter, dragState.isDragging, dragState.currentPos]);

  const avgMicroseconds =
    stats.totalUpdates > 0
      ? // eslint-disable-next-line total-functions/no-partial-division
        (stats.totalMicroseconds / stats.totalUpdates).toFixed(1)
      : '0.0';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        {adapter.name}
      </h3>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: '1px solid var(--sl-color-gray-5, #d1d5db)',
          borderRadius: '6px',
          background: 'var(--sl-color-bg-nav, #fff)',
        }}
      />
      <div
        style={{
          fontSize: '13px',
          fontFamily: 'monospace',
          lineHeight: 1.6,
          textAlign: 'left',
          width: '100%',
          padding: '0 4px',
        }}
      >
        <div>Total updates: {stats.totalUpdates}</div>
        <div
          style={{
            color: stats.glitches > 0 ? '#ef4444' : 'inherit',
            fontWeight: stats.glitches > 0 ? 700 : 400,
          }}
        >
          Glitches: {stats.glitches}
        </div>
        <div>Avg μs/update: {avgMicroseconds}</div>
      </div>
    </div>
  );
};
