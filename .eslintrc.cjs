module.exports = {
  env: {
    node: true,
    es2022: true
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    quotes: ['error', 'single'],
    'no-console': 'off',
    'import/extensions': 'off',
    'import/no-named-as-default': 'off',
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off',
    'max-len': [
      'error',
      {
        ignoreComments: true,
        code: 150,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ]
  }
};
