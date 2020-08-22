import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const terser = require('rollup-plugin-terser').terser;
const minifyLiteralsHTMLPlugin = require('rollup-plugin-minify-html-literals').default;

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export const dev = (input, file, plugins) => ({
  input,
  output: {
    file,
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins: [resolve(), ...plugins],
});

export const prod = (input, file, plugins) => ({
  input,
  output: {
    file,
    format: 'es',
  },
  plugins: [resolve(), terser(), minifyLiteralsHTMLPlugin(), ...plugins],
});

export default (input) => {
  return production ? prod(input) : dev(input);
};
