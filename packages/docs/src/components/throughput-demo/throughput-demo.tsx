import { useCallback, useMemo, useState } from 'react';
import { asSafeUint } from 'ts-data-forge';
import {
  createJotaiThroughputAdapter,
  createSynStateThroughputAdapter,
} from './adapters/index.mjs';
import { ThroughputCanvas } from './throughput-canvas.js';

const DEFAULT_CHAIN_DEPTH = 50;

const MIN_DEPTH = 10;

const MAX_DEPTH = 200;

const DEFAULT_TICKS = 100;

const MIN_TICKS = 1;

const MAX_TICKS = 1000;

export const ThroughputDemo: React.FC = () => {
  const [chainDepth, setChainDepth] = useState<SafeUint>(
    asSafeUint(DEFAULT_CHAIN_DEPTH),
  );

  const [ticksPerFrame, setTicksPerFrame] = useState(DEFAULT_TICKS);

  const [mut_runningMap, setRunningMap] = useState<Record<string, boolean>>({});

  const adapters = useMemo(
    () => [createSynStateThroughputAdapter(), createJotaiThroughputAdapter()],
    [],
  );

  const toggleRunning = useCallback((name: string) => {
    setRunningMap((prev) => ({ ...prev, [name]: !(prev[name] ?? false) }));
  }, []);

  const handleDepthChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setChainDepth(asSafeUint(Number(e.target.value)));
    },
    [],
  );

  const handleTicksChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTicksPerFrame(Number(e.target.value));
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
          marginBottom: '8px',
          flexWrap: 'wrap',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        >
          Chain depth (M): {chainDepth}
        </label>
        <input
          type="range"
          min={MIN_DEPTH}
          max={MAX_DEPTH}
          step={10}
          value={chainDepth}
          onChange={handleDepthChange}
          style={{ width: '200px' }}
        />
      </div>
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
          Ticks / frame (K): {ticksPerFrame}
        </label>
        <input
          type="range"
          min={MIN_TICKS}
          max={MAX_TICKS}
          step={10}
          value={ticksPerFrame}
          onChange={handleTicksChange}
          style={{ width: '200px' }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          alignItems: 'flex-start',
          userSelect: 'none',
          padding: '16px 0',
        }}
      >
        {adapters.map((adapter) => (
          <ThroughputCanvas
            key={adapter.name}
            adapter={adapter}
            chainDepth={chainDepth}
            ticksPerFrame={ticksPerFrame}
            running={mut_runningMap[adapter.name] ?? false}
            onToggle={() => {
              toggleRunning(adapter.name);
            }}
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
        A ball orbits automatically. K source updates are pushed through a
        depth-M reactive chain each frame. Increase K to see per-update overhead
        diverge.
      </p>
    </div>
  );
};
