module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
    'node': true
  },
  'plugins': [
    'babel'
  ],
  'parser': 'babel-eslint',
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
    'strict': [ 'error', 'safe' ],
    'require-atomic-updates': 0
  }
};
