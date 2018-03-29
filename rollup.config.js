import common from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/next.js',
  output: {
    file: 'dist/next.js',
    format: 'umd',
    name: 'NEXT'
  },
  plugins: [
    resolve({
      browser: true,
      jsnext: true,
      preferBuiltins: true,
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    common(),
    json(),
    globals()
  ]
};
