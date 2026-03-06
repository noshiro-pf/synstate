import { useCallback, useEffect, useRef, useState } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './adapters/index.mjs';
import { type Adapter, type Point } from './types.mjs';

type Stats = Readonly<{
  totalUpdates: number;
  glitches: number;
  totalMicroseconds: number;
}>;

type Props = Readonly<{
  adapter: Adapter;
}>;

const DOT_RADIUS = 2.5;

const COLOR_NORMAL = 'rgba(59, 130, 246, 0.7)';

const COLOR_GLITCH = 'rgba(239, 68, 68, 0.7)';

const INITIAL_STATS: Stats = {
  totalUpdates: 0,
  glitches: 0,
  totalMicroseconds: 0,
};

export const RectCanvas: React.FC<Props> = ({ adapter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const latestPosRef = useRef<Point>({ x: -1, y: -1 });

  const isDraggingRef = useRef(false);

  const [stats, setStats] = useState<Stats>(INITIAL_STATS);

  // Setup adapter once on mount
  useEffect(() => {
    adapter.setup({
      onEmit: (pos) => {
        if (!isDraggingRef.current) return;

        if (pos.x < 0 || pos.y < 0) return;

        const t0 = performance.now();

        const latestPos = latestPosRef.current;

        const mut_glitch = pos.x !== latestPos.x || pos.y !== latestPos.y;

        const mut_ctx = canvasRef.current?.getContext('2d');

        if (mut_ctx != null) {
          mut_ctx.beginPath();

          mut_ctx.arc(pos.x, pos.y, DOT_RADIUS, 0, Math.PI * 2);

          mut_ctx.fillStyle = mut_glitch ? COLOR_GLITCH : COLOR_NORMAL;

          mut_ctx.fill();
        }

        const elapsed = (performance.now() - t0) * 1000; // to microseconds

        setStats((prev) => ({
          totalUpdates: prev.totalUpdates + 1,
          glitches: prev.glitches + (mut_glitch ? 1 : 0),
          totalMicroseconds: prev.totalMicroseconds + elapsed,
        }));
      },
    });

    return () => {
      adapter.cleanup();
    };
  }, []);

  const getCanvasPos = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = canvasRef.current;

      if (canvas == null) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [],
  );

  const handleMouseDown = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      // Clear canvas for new drag
      const ctx = canvasRef.current?.getContext('2d');

      ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      setStats(INITIAL_STATS);

      isDraggingRef.current = true;

      const pos = getCanvasPos(e);

      latestPosRef.current = pos;

      adapter.onMouseMove(pos);
    },
    [adapter, getCanvasPos],
  );

  const handleMouseMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;

      const pos = getCanvasPos(e);

      latestPosRef.current = pos;

      adapter.onMouseMove(pos);
    },
    [adapter, getCanvasPos],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          border: '1px solid var(--sl-color-gray-5, #d1d5db)',
          borderRadius: '6px',
          background: 'var(--sl-color-bg-nav, #fff)',
          cursor: 'crosshair',
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
