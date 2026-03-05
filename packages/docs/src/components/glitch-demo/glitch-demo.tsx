import { useMemo } from 'react';
import {
  createJotaiAdapter,
  createRxJSAdapter,
  createSynStateAdapter,
} from './adapters/index.mjs';
import { RectCanvas } from './rect-canvas.js';

export const GlitchDemo: React.FC = () => {
  const adapters = useMemo(
    () => [createSynStateAdapter(), createRxJSAdapter(), createJotaiAdapter()],
    [],
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          userSelect: 'none',
          padding: '16px 0',
        }}
      >
        {adapters.map((adapter) => (
          <RectCanvas key={adapter.name} adapter={adapter} />
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
        Click and drag on each canvas to draw a trail. Each dot is placed by the
        library's reactive pipeline. Blue = consistent, Red = glitch (one axis
        updated before the other).
      </p>
    </div>
  );
};
