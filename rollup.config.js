import typescriptPlugin from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import analyze from 'rollup-plugin-analyzer';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import minifyTaggedCSSTemplate from 'rollup-plugin-minify-tagged-css-template';
const terser = require('rollup-plugin-terser').terser;

import { DEFAULT_EXTENSIONS } from '@babel/core';

const atImport = require('postcss-import');

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const plug = {
  replace: replace({
    'process.env.NODE_ENV': production ? JSON.stringify('production') : JSON.stringify('development'),
  }),
  resolve: resolve(),
  ts: typescriptPlugin({
    tsconfig: `./tsconfig.${production ? 'prod' : 'dev'}.json`,
  }),
  babel: babel({
    babelHelpers: 'bundled',
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    exclude: 'node_modules/**',
  }),
  postcss: postcss({
    inject: false,
    extensions: ['.css', '.pcss', '.scss'],
    plugins: [atImport()],
  }),
};

export const dev = (input, file) => ({
  input,
  output: {
    file,
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins: [plug.replace, plug.resolve, plug.ts, plug.babel, plug.postcss],
});
export const test = (input, dir) => ({
  input,
  output: {
    dir,
    format: 'es',
    sourcemap: true,
  },
  manualChunks: {
    vendors: ['@web-companions/fc'],
  },
  plugins: [plug.replace, plug.resolve, typescriptPlugin({ tsconfig: `./tsconfig.dev.json` }), plug.babel, plug.postcss],
});

export const prod = (input, file) => ({
  input,
  output: {
    file,
    format: 'es',
  },
  plugins: [
    plug.replace,
    plug.resolve,
    plug.ts,
    plug.babel,
    plug.postcss,
    minifyHTML(),
    minifyTaggedCSSTemplate({
      parserOptions: {
        sourceType: 'module', // treat files as ES6 modules
        plugins: [
          'syntax-dynamic-import', // handle dynamic imports
          [
            'decorators', // use decorators proposal plugin
            { decoratorsBeforeExport: true },
          ],
        ],
      },
    }),
    terser(),
    analyze(),
  ],
  external: ['@web-companions/fc'],
});

export const prodIife = (input, file) => ({
  input,
  output: {
    file,
    format: 'iife',
    name: 'LoadingProgressBar',
  },
  plugins: [
    plug.replace,
    plug.resolve,
    plug.ts,
    plug.babel,
    plug.postcss,
    minifyHTML(),
    minifyTaggedCSSTemplate({
      parserOptions: {
        sourceType: 'module', // treat files as ES6 modules
        plugins: [
          'syntax-dynamic-import', // handle dynamic imports
          [
            'decorators', // use decorators proposal plugin
            { decoratorsBeforeExport: true },
          ],
        ],
      },
    }),
    terser(),
  ],
});

export default production
  ? [prod('./src/index.tsx', './lib/index.es.js'), prodIife('./src/index.tsx', './lib/index.js'), test('./www/src/test.tsx', './www')]
  : [dev('./www/src/index.tsx', './www/index.js'), test('./www/src/test.tsx', './www')];
