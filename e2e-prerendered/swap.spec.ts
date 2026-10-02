import { expect, test, type Page } from '@playwright/test';

// Real visitors load a fully pre-rendered page; src/main.tsx keeps it on screen
// while the live app renders invisibly, then swaps the two in one step. These
// tests guard that behaviour on the production build, where it actually runs.

const routes = ['/', '/books/', '/books/the-shadow-code/', '/start-here/', '/privacy-policy/'];

async function waitForSwap(page: Page) {
  await page.waitForFunction(() => !document.getElementById('root') && !!document.getElementById('app'), undefined, { timeout: 10000 });
}

for (const route of routes) {
  test(`swap leaves exactly one working page: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

    await page.goto(route);
    await waitForSwap(page);

    expect(await page.locator('h1').count(), 'exactly one H1 after the swap').toBe(1);
    expect(await page.locator('main').count(), 'exactly one <main> after the swap').toBe(1);
    const revealed = await page.locator('#app').evaluate((el) => {
      const s = getComputedStyle(el);
      return s.visibility === 'visible' && s.overflow !== 'hidden' && el.getBoundingClientRect().height > 200;
    });
    expect(revealed, 'live app is revealed, not left clipped or hidden').toBe(true);
    expect(errors, `console/page errors on ${route}`).toEqual([]);
  });

  test(`no meaningful layout shift while loading: ${route}`, async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
          if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(route);
    await waitForSwap(page);
    await page.waitForTimeout(1500);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    // The page measured 0.2-0.67 before the swap fix and ~0.00 after. 0.25 is
    // Google's "poor" line - generous enough for a slow CI runner, tight
    // enough to catch the old wipe-and-rebuild behaviour coming back.
    expect(cls, `cumulative layout shift on ${route}`).toBeLessThan(0.25);
  });
}

test('mobile menu works after the swap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await waitForSwap(page);
  await page.getByRole('button', { name: /open menu/i }).click();
  await expect(page.getByRole('dialog').first()).toBeVisible();
});

test('current page is highlighted in the nav on the canonical slashed URL', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/start-here/');
  await waitForSwap(page);
  await expect(page.locator('header a[aria-current="page"]')).toHaveText(/start here/i);
});
