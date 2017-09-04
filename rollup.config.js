import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve'; // to import node_modules packages easily
import commonjs from 'rollup-plugin-commonjs'; // convert commonjs to es6 (in case you use require)

export default {
  entry: 'src/main.js',
  dest: 'build/index.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
        include: 'src/**'
    }),
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    })
  ],
};
