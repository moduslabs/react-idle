import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.js',
  output: {
    file: 'dist/umd/react-idle.js',
    format: 'umd',
    name: 'ReactIdle',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  external: ['react', 'react-dom'],
  plugins: [
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    terser({
      mangle: false,
      output: {
        beautify: true,
      },
    }),
  ],
};
