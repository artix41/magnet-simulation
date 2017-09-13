import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve'; // to import node_modules packages easily
import commonjs from 'rollup-plugin-commonjs'; // convert commonjs to es6 (in case you use require)

export default {
  input: 'src/main.js',
  output: {
      file:'build/index.js',
      format: 'iife'
  },
  sourcemap: 'inline',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
        include: ['node_modules/**']
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
