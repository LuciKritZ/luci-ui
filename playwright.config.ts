import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:9000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:9000',
  },
  workers: process.env.CI ? 1 : undefined,
});
