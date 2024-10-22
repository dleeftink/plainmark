import { defineConfig } from 'vitest/config'
import { builtinEnvironments } from 'vitest/environments'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // setupFiles: ['./src/setupTests.ts'],
    include: ['**/*.test.{js,jsx,ts,tsx}', '**/*.{spec,test}.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    //assetsInclude: ['**/*.html'],
    environmentOptions: {
      url: 'http://localhost:3000',
    },
    forceRerunTriggers: ['**/*.html']
  },
})