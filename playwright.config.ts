import { defineConfig, devices, type ReporterDescription } from '@playwright/test'

const isCI = Boolean(process.env.CI)
const reporters: ReporterDescription[] = isCI
  ? [
      ['list'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ]
  : [['list']]

export default defineConfig({
  testDir: './apps/frontend/tests/playwright',
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  reporter: reporters,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  retries: isCI ? 1 : 0,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:backend',
      port: 3000,
      reuseExistingServer: !isCI,
      env: {
        NODE_ENV: process.env.NODE_ENV ?? 'development',
      },
    },
    {
      command: 'npx vite --config apps/frontend/vite.config.ts --host 127.0.0.1 --port 5173',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !isCI,
      env: {
        ...process.env,
        VITE_API_URL: process.env.VITE_API_URL ?? 'http://127.0.0.1:3000',
      },
    },
  ],
})
