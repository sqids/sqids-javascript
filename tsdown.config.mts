import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: false,
  dts: { generator: 'tsc', newContext: true },
  entry: ['src/sqids.ts'],
  fixedExtension: false,
  outputOptions: (options, format) => ({
    ...options,
    entryFileNames: format === 'umd' ? 'sqids.js' : '[name].js',
  }),
  platform: 'neutral',
  sourcemap: true,
  suppressWarnings: ['MIXED_EXPORTS'],
  target: 'es2020',
  tsconfig: 'tsconfig.build.json',
})
