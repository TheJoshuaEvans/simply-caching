module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2022': true
  },
  'parserOptions': {
    'sourceType': 'script'
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
    'describe': 'readonly',
    'it': 'readonly',
    'before': 'readonly',
    'after': 'readonly'
  },
  'rules': {
    'indent': [ 'error', 2 ],
    'linebreak-style': [ 'error', 'unix' ],
    'quotes': [ 'error', 'single' ],
    'semi': [ 'error', 'always' ],
    'prefer-const': [ 'error' ],
    'eol-last': [ 'error', 'always' ],
    'require-atomic-updates': 0
  }
};
