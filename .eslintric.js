module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier', // Turn off all rules that are unnecessary or might conflict with Prettier
    'plugin:prettier/recommended', // Enables prettier plugin rules
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Ensure Prettier errors are treated as ESLint errors
    'react/no-unescaped-entities': 'none',
  },
};
