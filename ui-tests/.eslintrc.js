const off = 'off';

module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest-playwright/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  ignorePatterns: ['jest/*.js'],
  rules: {
    'import/extensions': off,
    'import/no-unresolved': off,
    'import/prefer-default-export': off,
    'max-classes-per-file': off,
    'no-restricted-syntax': off,
    'no-use-before-define': off,
    'no-useless-constructor': off,
    'no-unused-vars': off,
    '@typescript-eslint/explicit-module-boundary-types': off,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
