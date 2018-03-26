import common from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/lib.js',
  output: {
    file: 'dist/next.js',
    format: 'cjs'
  },
  plugins: [
    resolve({
      browser: true,
      jsnext: true,
      preferBuiltins: true,
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    common(),
    json()
  ]
};