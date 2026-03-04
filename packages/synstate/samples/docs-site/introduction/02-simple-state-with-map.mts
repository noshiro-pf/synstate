import {
  combine,
  createState,
  type InitializedObservable,
  map,
} from 'synstate';

const [count, setCount] = createState<number>(0);

// Read the current value
console.log(count.getSnapshot().value); // 0

// Derive new Observables using pipe
const doubled: InitializedObservable<number> = count.pipe(map((n) => n * 2));

// Combine multiple Observables
const combined: InitializedObservable<string> = combine([count, doubled]).pipe(
  map(([c, d]) => `count=${c}, doubled=${d}`),
);

// Subscribe to changes
count.subscribe((value) => {
  console.log('count:', value); // 0, 1, 2, 3, 4
});

doubled.subscribe((value) => {
  console.log('doubled:', value); // 0, 2, 4, 6, 8
});

combined.subscribe((value) => {
  console.log(value); // "count=0, doubled=0", "count=1, doubled=2", ...
});

let cnt = 0;

const timer = setInterval(() => {
  cnt += 1;

  setCount(cnt);
}, 1000 /* ms */);

setTimeout(() => {
  clearTimeout(timer);
}, 5000);

// embed-sample-code-ignore-below

if (import.meta.vitest !== undefined) {
  test('simple-state', () => {
    assert.isTrue(true);
  });
}
