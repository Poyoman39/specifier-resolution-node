module.exports = {
  parser: '@babel/eslint-parser',
  extends: 'airbnb-base',
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    'no-continue': 'off',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'max-len': [
      'warn', {
        code: 100,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'padding-line-between-statements': [
      'warn', {
        blankLine: 'always',
        prev: [
          'block',
          'block-like',
          'class',
          'export',
          'import',
        ],
        next: '*',
      }, {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      }, {
        blankLine: 'any',
        prev: ['export', 'import'],
        next: ['export', 'import'],
      },
    ],
  },
};
