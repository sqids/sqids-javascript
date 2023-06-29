import type { ScaffoldConfig } from '@niieani/scaffold'

const config: ScaffoldConfig = {
  module: '@niieani/scaffold',
  drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript', 'webpack'],
  settings: {
    node: true,
    name: 'Sqids',
    engineTarget: 'web',
    codeTarget: 'es6',
    umd: {
      filename: 'sqids.js',
      export: 'default',
    },
  },
}

export default config
