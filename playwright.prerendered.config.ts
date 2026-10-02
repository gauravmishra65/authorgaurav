import { defineConfig, devices } from '@playwright/test';

// Tests the PRODUCTION build (dist/, served by `vite preview`) rather than the
// dev server. The main e2e suite (playwright.config.ts) runs against `npm run
// dev`, where #root starts empty, so it never exercises the path real
// visitors hit: a pre-rendered page that the live app must swap in place of
// (src/main.tsx). Run `npm run build` first.
export default defineConfig({
  testDir: './e2e-prerendered',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
