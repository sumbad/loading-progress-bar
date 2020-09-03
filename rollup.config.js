import { dev, prod } from './base.rollup.config';

import typescriptPlugin from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import analyze from 'rollup-plugin-analyzer'
const terser = require('rollup-plugin-terser').terser;
const minifyLiteralsHTMLPlugin = require('rollup-plugin-minify-html-literals').default;

import { DEFAULT_EXTENSIONS } from '@babel/core';

const atImport = require('postcss-import');

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const plugins = [
  typescriptPlugin({
    tsconfig: `./tsconfig.${production ? 'prod' : 'dev'}.json`,
  }),
  babel({
    babelHelpers: 'bundled',
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    exclude: 'node_modules/**'
  }),
  postcss({
    inject: false,
    extensions: ['.css', '.pcss', '.scss'],
    plugins: [atImport()],
  }),
  analyze(),
];


export const prodIife = (input, file, plugins) => ({
  input,
  output: {
    file,
    format: 'iife',
  },
  plugins: [resolve(), terser(), minifyLiteralsHTMLPlugin(), ...plugins],
  // indicate which modules should be treated as external
  // external: ['@web-companions/fc', 'haunted', 'lit-html'],
});

export default production
  ? [
      prod('./src/index.tsx', './lib/index.js', plugins), 
      // prodIife('./src/loading-progress-bar.tsx', './lib/loading-progress-bar.js', plugins)
    ]
  : dev('./www/src/index.tsx', './www/index.js', plugins);
