import { useCallback, useEffect, useRef, useState } from 'react';
import { Arr, asSafeUint, range } from 'ts-data-forge';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './adapters/index.js';
import { type Point, type SpringAdapter } from './types.js';

type Stats = Readonly<{
  totalUpdates: number;
  totalMicroseconds: number;
}>;

type Props = Readonly<{
  adapter: SpringAdapter;
  chainDepth: SafeUint;
}>;

const INITIAL_STATS: Stats = {
  totalUpdates: 0,
  totalMicroseconds: 0,
};

const HEAD_RADIUS = 5;

const TAIL_MIN_RADIUS = 1.5;

const drawSnake = (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  mut_ctx: CanvasRenderingContext2D,
  points: readonly Point[],
): void => {
  mut_ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (Arr.isArrayOfLength(points, 0)) return;

  const segmentCount = asSafeUint(points.length);

  // Draw tail segments (lines connecting dots)
  if (Arr.isArrayAtLeastLength(points, 2)) {
    mut_ctx.beginPath();

    mut_ctx.moveTo(points[0].x, points[0].y);

    for (const mut_i of range(1, segmentCount)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mut_ctx.lineTo(points[mut_i]!.x, points[mut_i]!.y);
    }

    mut_ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';

    mut_ctx.lineWidth = 1;

    mut_ctx.stroke();
  }

  // Draw dots at each stage position (tail first, head last so it's on top)
  for (let mut_i = segmentCount - 1; mut_i >= 0; mut_i--) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const point = points[mut_i]!;

    // eslint-disable-next-line total-functions/no-partial-division
    const t = segmentCount > 1 ? mut_i / (segmentCount - 1) : 0;

    const radius = HEAD_RADIUS - t * (HEAD_RADIUS - TAIL_MIN_RADIUS);

    const alpha = 1 - t * 0.7;

    mut_ctx.beginPath();

    mut_ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);

    mut_ctx.fillStyle =
      mut_i === 0
        ? `rgba(59, 130, 246, ${String(alpha)})`
        : `rgba(147, 197, 253, ${String(alpha)})`;

    mut_ctx.fill();
  }
};

export const SnakeCanvas: React.FC<Props> = ({ adapter, chainDepth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stats, setStats] = useState<Stats>(INITIAL_STATS);

  // Re-setup adapter when chainDepth changes
  useEffect(() => {
    let mut_active = true;

    adapter.setup(chainDepth, {
      onEmit: (points) => {
        if (!mut_active) return;

        const t0 = performance.now();

        const mut_ctx = canvasRef.current?.getContext('2d');

        if (mut_ctx != null) {
          drawSnake(mut_ctx, points);
        }

        const elapsed = (performance.now() - t0) * 1000; // to microseconds

        setStats((prev) => ({
          totalUpdates: prev.totalUpdates + 1,
          totalMicroseconds: prev.totalMicroseconds + elapsed,
        }));
      },
    });

    return () => {
      mut_active = false;

      adapter.cleanup();
    };
  }, [chainDepth]);

  const handleMouseMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;

      if (canvas == null) return;

      const rect = canvas.getBoundingClientRect();

      adapter.onMouseMove({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [adapter],
  );

  const handleMouseLeave = useCallback(() => {
    adapter.onMouseMove({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  }, [adapter]);

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
        onMouseMove={handleMouseMove}
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
        <div>Avg μs/update: {avgMicroseconds}</div>
      </div>
    </div>
  );
};
