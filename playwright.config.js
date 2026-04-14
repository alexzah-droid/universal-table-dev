const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const UNIVERSAL_URL = `file://${path.resolve(__dirname, 'universal-table.html')}`;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: UNIVERSAL_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'desktop-chrome',
      grep: /@desktop/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile-chrome',
      grep: /@mobile/,
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
});

module.exports.UNIVERSAL_URL = UNIVERSAL_URL;
