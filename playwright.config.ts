import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 60000, fullyParallel: false,
  use: { baseURL: 'http://localhost:3000', browserName: 'chromium', reducedMotion: 'reduce', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI, timeout: 120000 },
});
