import { createEventEmitter } from 'synstate';

if (import.meta.vitest !== undefined) {
  test(createEventEmitter, () => {
    // embed-sample-code-ignore-above

    const [click$, emitClick] = createEventEmitter();

    const clickCount = { value: 0 };

    click$.subscribe(() => {
      clickCount.value += 1;
    });

    emitClick(); // logs: Clicked!

    assert.deepStrictEqual(clickCount.value, 1);

    emitClick();

    emitClick();

    assert.deepStrictEqual(clickCount.value, 3);

    // embed-sample-code-ignore-below
  });
}
