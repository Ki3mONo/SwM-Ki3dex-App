/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const tseslint = require('typescript-eslint')

module.exports = defineConfig([
  expoConfig,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['metro.config.js', 'babel.config.js', 'app.config.ts', 'app.config.js'],
    env: {
      node: true,
    },
  },
])
