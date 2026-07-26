import { expect, test } from '@playwright/test';

test('homepage loads with exactly one H1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('an invalid URL reaches the branded 404 page, not a blank screen', async ({ page }) => {
  await page.goto('/this-route-does-not-exist-xyz');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();
});

test('no horizontal overflow at 320px width on the homepage', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(overflow).toBe(true);
});

test('no horizontal overflow at 320px width on the books page', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/books');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(overflow).toBe(true);
});

test('the contact form honeypot is hidden from the accessibility tree', async ({ page }) => {
  await page.goto('/contact');
  const honeypot = page.locator('#company');
  await expect(honeypot).toBeAttached();
  // aria-hidden lives on the wrapping div, not the input itself — walk up
  // and confirm the whole subtree is hidden from assistive tech.
  const hiddenFromAT = await honeypot.evaluate((el) => {
    let node: Element | null = el;
    while (node) {
      if (node.getAttribute('aria-hidden') === 'true') return true;
      node = node.parentElement;
    }
    return false;
  });
  expect(hiddenFromAT).toBe(true);
});

test('contact form shows a validation error on empty submit, never silently fails', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.getByRole('alert').first()).toBeVisible();
});

test('no retailer/buy link on the books page is a bare "#" placeholder', async ({ page }) => {
  await page.goto('/books');
  const hrefs = await page.locator('a').evaluateAll((els) =>
    els.map((el) => el.getAttribute('href')).filter((h): h is string => !!h)
  );
  const placeholders = hrefs.filter((h) => h === '#');
  expect(placeholders).toEqual([]);
});
