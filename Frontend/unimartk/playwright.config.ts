import { defineConfig, devices, expect } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,

  // ✅ This is the correct place for timeouts per action
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    actionTimeout: 10000, // max time for actions like click, fill, etc.
  },

  // ✅ Top-level setting for expect timeout
  expect: {
    timeout: 8000, // max time for assertions like toBeVisible()
  },

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },

  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  projects: [
    {
      name: 'Edge',
      use: {
        ...devices['Desktop Edge'],
      },
    },
  ],
});
