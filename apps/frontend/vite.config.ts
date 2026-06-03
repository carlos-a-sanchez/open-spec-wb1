import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  // @ts-expect-error Vite types can mismatch between vitest and workspace dependencies
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['tests/playwright/**'],
  },
})
