module.exports = {
  plugins: ['unused-imports', 'tailwindcss', 'prettier'],
  extends: [
    'next/core-web-vitals',
    'next',
    'eslint:recommended',
    'plugin:storybook/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  globals: {
    React: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    },
  ],
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
    'tailwindcss/no-custom-classname': 'warn',
    'tailwindcss/classnames-order': 'warn',

    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
};
