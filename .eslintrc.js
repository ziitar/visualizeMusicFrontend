module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6, //也就是ES6语法支持的意思
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    browser: true,
    node: true,
    jasmine: true,
  },
  globals: {
    PROCESS_ENV: true,
  },
  // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
  // https://github.com/prettier/eslint-plugin-prettier
  // https://github.com/prettier/eslint-config-prettier
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-floating-promises': 'warn'
  },
};
