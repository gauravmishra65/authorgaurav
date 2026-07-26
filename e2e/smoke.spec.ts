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

for (const route of ['/', '/about', '/contact', '/media', '/book-clubs']) {
  test(`no href="#" anywhere on ${route}`, async ({ page }) => {
    await page.goto(route);
    const hrefs = await page.locator('a[href]').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs.filter((h) => h === '#')).toEqual([]);
  });
}

for (const route of ['/about', '/contact']) {
  test(`no horizontal overflow at 320px width on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(overflow).toBe(true);
  });
}

test('Shadow Code purchase links are real https, open in a new tab, and never expose the opener', async ({ page }) => {
  await page.goto('/books/the-shadow-code');
  const buyLinks = page.locator('a[target="_blank"]').filter({ hasText: /Amazon|Kindle|Paperback|Notionpress/i });
  await expect(buyLinks.first()).toBeVisible();
  const count = await buyLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const link = buyLinks.nth(i);
    await expect(link).toHaveAttribute('href', /^https:\/\//);
    const rel = await link.getAttribute('rel');
    expect(rel).toContain('noopener');
  }
});

test('A Journey of Grace shows zero purchase links (no real retailer link exists yet — never a fake one)', async ({ page }) => {
  await page.goto('/books/journey-of-grace');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A Journey of Grace');
  const buyLinks = page.locator('a').filter({ hasText: /Amazon|Kindle|Paperback|Buy Now/i });
  await expect(buyLinks).toHaveCount(0);
});

test('a Hindi book page renders with lang="hi" on the document', async ({ page }) => {
  await page.goto('/books/vishnu-sahasranama');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi', { timeout: 10000 });
});

test('mobile nav drawer opens as an accessible dialog and closes via its close button', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const dialog = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close menu' }).click();
  await expect(dialog).not.toBeVisible();
});

test('sitemap.xml is served directly with a 200 and XML content', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('<urlset');
  expect(body).toContain('https://authorgaurav.com/');
});

test('a book page canonical tag is the trailing-slash form matching the sitemap convention', async ({ page }) => {
  await page.goto('/books/offbeat-love');
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href', { timeout: 10000 });
  expect(canonical).toBe('https://authorgaurav.com/books/offbeat-love/');
});

test('newsletter form shows a client-side error for an invalid email, without submitting to the server', async ({ page }) => {
  await page.goto('/');
  const requests: string[] = [];
  page.on('request', (req) => { if (req.url().includes('newsletter-subscribe')) requests.push(req.url()); });

  await page.getByLabel('Email address').last().fill('not-an-email');
  await page.getByRole('checkbox').last().check();
  await page.getByRole('button', { name: /subscribe/i }).last().click();

  await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
  expect(requests).toEqual([]);
});

test('Offbeat Love discussion guide has a real, working download link on the Book Clubs page', async ({ page }) => {
  await page.goto('/book-clubs');
  const link = page.getByRole('link', { name: /download these questions/i });
  await expect(link).toHaveAttribute('href', '/resources/book-club-questions-offbeat-love.txt');
  const res = await page.request.get('/resources/book-club-questions-offbeat-love.txt');
  expect(res.status()).toBe(200);
});
