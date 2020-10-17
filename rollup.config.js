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

const plugins = [
  replace({
    'process.env.NODE_ENV': production ? JSON.stringify('production') : JSON.stringify('development'),
  }),
  resolve(),
  typescriptPlugin({
    tsconfig: `./tsconfig.${production ? 'prod' : 'dev'}.json`,
  }),
  babel({
    babelHelpers: 'bundled',
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    exclude: 'node_modules/**',
  }),
  postcss({
    inject: false,
    extensions: ['.css', '.pcss', '.scss'],
    plugins: [atImport()],
  }),
];

export const dev = (input, file, plugins) => ({
  input,
  output: {
    file,
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins,
});

export const prod = (input, file, plugins) => ({
  input,
  output: {
    file,
    format: 'es',
  },
  plugins: [
    ...plugins,
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
  external: ['@web-companions/fc']
});

export const prodIife = (input, file, plugins) => ({
  input,
  output: {
    file,
    format: 'iife',
    name: 'loadingProgressBar',
  },
  plugins: [
    ...plugins,
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
  ? [
      prod('./src/index.tsx', './lib/index.es.js', plugins),
      prodIife('./src/index.tsx', './lib/index.js', plugins),
    ]
  : dev('./www/src/index.tsx', './www/index.js', plugins);
