import { useCallback, useMemo, useState } from 'react';
import { asSafeUint } from 'ts-data-forge';
import {
  createJotaiSpringAdapter,
  createRxJSSpringAdapter,
  createSynStateSpringAdapter,
} from './adapters/index.mjs';
import { SnakeCanvas } from './snake-canvas.js';

const DEFAULT_CHAIN_DEPTH = 50;

const MIN_DEPTH = 10;

const MAX_DEPTH = 500;

export const SpringDemo: React.FC = () => {
  const [chainDepth, setChainDepth] = useState<SafeUint>(
    asSafeUint(DEFAULT_CHAIN_DEPTH),
  );

  const adapters = useMemo(
    () => [
      createSynStateSpringAdapter(),
      createRxJSSpringAdapter(),
      createJotaiSpringAdapter(),
    ],
    [],
  );

  const handleDepthChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setChainDepth(asSafeUint(Number(e.target.value)));
    },
    [],
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        >
          Chain depth (N): {chainDepth}
        </label>
        <input
          type="range"
          min={MIN_DEPTH}
          max={MAX_DEPTH}
          step={10}
          value={chainDepth}
          onChange={handleDepthChange}
          style={{ width: '240px' }}
        />
      </div>
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
          <SnakeCanvas
            key={adapter.name}
            adapter={adapter}
            chainDepth={chainDepth}
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
        Move your mouse over each canvas. The snake tail has N segments, each a
        stage in a reactive scan chain. Increase N to see performance diverge.
      </p>
    </div>
  );
};
