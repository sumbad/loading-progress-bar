import { dev, prod } from './base.rollup.config';

import typescriptPlugin from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
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
  }),
  postcss({
    inject: false,
    extensions: ['.css', '.pcss', '.scss'],
    plugins: [atImport()],
  }),
];

export default production
  ? [
      prod('./src/index.tsx', './lib/index.js', plugins), 
      dev('./src/loading-progress-bar.tsx', './lib/loading-progress-bar.js', plugins)
    ]
  : dev('./www/src/index.tsx', './www/index.js', plugins);
