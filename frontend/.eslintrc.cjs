const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json')
      }
    }
  },
  rules: {
    'prettier/prettier': 0,
    // Vue: Recommended rules to be closed or modify
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    // Vue: Add extra rules
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
    'vue/multi-word-component-names': 0,
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-shadow': 0,
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-param-reassign': 0,
    'prefer-regex-literals': 0,
    'import/no-extraneous-dependencies': 0,
    'no-undef': 0,
    'no-shadow': 0,
    'import/prefer-default-export': 0,
    'no-use-before-define': 0,
    'no-useless-escape': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',    // Node "builtin" modules (fs, path)
          'external',   // 第三方模块
          'internal',   // 你自己项目的模块（@/ 或 ~）
          ['parent', 'sibling', 'index'], // 相对路径导入
          'object',     // import 'foo' 这种形式
          'type'        // 类型导入（如果是 TS）
        ],
        pathGroups: [
          {
            pattern: '@/**', // 如果你用了路径别名（例如 @ 开头）
            group: 'internal'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always', // 每组之间换行
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  }
}
