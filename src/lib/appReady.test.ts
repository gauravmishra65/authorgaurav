import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackLoad, whenAppReady } from './appReady';

function container(withHeading: boolean): HTMLElement {
  const el = document.createElement('div');
  if (withHeading) el.appendChild(document.createElement('h1'));
  return el;
}

describe('whenAppReady', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves once a heading exists and no load is in flight', async () => {
    const ready = vi.fn();
    whenAppReady(container(true)).then(ready);
    await vi.advanceTimersByTimeAsync(100);
    expect(ready).not.toHaveBeenCalled(); // needs 3 consecutive stable checks
    await vi.advanceTimersByTimeAsync(100);
    expect(ready).toHaveBeenCalledTimes(1);
  });

  it('waits while a tracked load is still in flight', async () => {
    const finish = trackLoad();
    const ready = vi.fn();
    whenAppReady(container(true)).then(ready);
    await vi.advanceTimersByTimeAsync(1000);
    expect(ready).not.toHaveBeenCalled();
    finish();
    await vi.advanceTimersByTimeAsync(300);
    expect(ready).toHaveBeenCalledTimes(1);
  });

  it('waits for a heading even when nothing is loading', async () => {
    const ready = vi.fn();
    whenAppReady(container(false), 1000).then(ready);
    await vi.advanceTimersByTimeAsync(900);
    expect(ready).not.toHaveBeenCalled();
  });

  it('gives up after the timeout so a stuck load can never block the swap forever', async () => {
    const finish = trackLoad();
    const ready = vi.fn();
    whenAppReady(container(false), 1000).then(ready);
    await vi.advanceTimersByTimeAsync(1100);
    expect(ready).toHaveBeenCalledTimes(1);
    finish();
  });

  it('counts each load once even if its finish callback is called twice', async () => {
    const a = trackLoad();
    const b = trackLoad();
    a();
    a(); // must not also release b's slot
    const ready = vi.fn();
    whenAppReady(container(true)).then(ready);
    await vi.advanceTimersByTimeAsync(500);
    expect(ready).not.toHaveBeenCalled();
    b();
    await vi.advanceTimersByTimeAsync(300);
    expect(ready).toHaveBeenCalledTimes(1);
  });
});
