import resolve from '@rollup/plugin-node-resolve';

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
  // indicate which modules should be treated as external
  external: ['@web-companions/fc', 'haunted', 'lit-html'],
});

export default (input) => {
  return production ? prod(input) : dev(input);
};
