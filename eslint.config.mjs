import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends('plugin:prettier/recommended'),
  ...compat.plugins('prettier'),
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        require: true,
        module: true,
        process: true,
        __dirname: true,
        __filename: true,
        console: true,
        setTimeout: true,
        clearTimeout: true,
      },
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: true,
        test: true,
        expect: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true,
        jest: true,
      },
    },
  },
  {
    rules: {
      'prettier/prettier': 'error',
      'require-jsdoc': 'off',
    },
    ignores: ['frontend/', 'node_modules/', '*.config.js', '*.config.mjs'],
  },
];
