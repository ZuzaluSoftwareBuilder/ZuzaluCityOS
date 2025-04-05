module.exports = {
  plugins: ['unused-imports', 'tailwindcss', 'prettier'],
  extends: [
    'next/core-web-vitals',
    'next',
    'eslint:recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  globals: {
    React: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'tailwindcss/no-custom-classname': 'error',
    'tailwindcss/classnames-order': ['warn', { fixable: true }],

    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
  ignorePatterns: ['node_modules/', 'dist/', 'graphql/'],
};
