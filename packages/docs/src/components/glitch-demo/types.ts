export type Point = Readonly<{ x: number; y: number }>;

export type Size = Readonly<{ width: number; height: number }>;

export type RectData = Point & Size;

export type AdapterCallbacks = Readonly<{
  onEmit: (rect: RectData) => void;
}>;

export type Adapter = Readonly<{
  name: string;
  setup: (startPos: Point, callbacks: AdapterCallbacks) => void;
  onMouseMove: (pos: Point) => void;
  cleanup: () => void;
}>;

export type Subscription = Readonly<{
  unsubscribe: () => void;
}>;
