import common from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const minify = process.env.minify || false;

export default {
  input: 'src/next.js',
  output: {
    file: minify ? 'dist/next.min.js' : 'dist/next.js',
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
    minify ? uglify() : {}
  ]
};
