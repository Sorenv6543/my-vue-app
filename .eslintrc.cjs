module.exports = {
    env: {
      node: true,
      es2021: true,
      commonjs: true
    },
    extends: [
      'eslint:recommended'
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    globals: {
      process: true
    }
  }
  