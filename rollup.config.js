import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'

const globals = {
  'axios/lib/adapters/xhr': 'browserAdaptor',
  'axios/lib/adapters/http': 'nodeAdaptor',
  'axios/lib/cancel/Cancel': 'Cancel',
  md5: 'md5',
  axios: 'axios',
}

export default {
  input: 'index.js',
  output: [
    /** UMD */
    {
      file: 'dist/index.min.js',
      name: 'axiosMerge',
      exports: 'named',
      format: 'umd',
      plugins: [terser()],
      globals
    },
    {
      file: 'dist/index.js',
      name: 'axiosMerge',
      format: 'umd',
      exports: 'named',
      plugins: [],
      globals
    },

    /** CJS */
    {
      file: 'dist/cjs/index.min.js',
      format: 'cjs',
      exports: 'named',
      plugins: [terser()]
    },
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      exports: 'named',
      plugins: []
    },

    /** ESM */
    {
      file: 'dist/esm/index.min.js',
      format: 'esm',
      plugins: [terser()]
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      plugins: []
    }
  ],

  external: [
    'axios/lib/adapters/xhr',
    'axios/lib/adapters/http',
    'axios/lib/cancel/Cancel',
    'md5',
    'axios'
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' })
  ]
}
