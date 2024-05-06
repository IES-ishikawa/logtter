module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier',
    'prettier'
  ],
  plugins: ['import', 'unused-imports'],
  rules: {
    'unused-imports/no-unused-imports': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'object', 'type', 'index'],
        pathGroups: [
          {
            pattern: '{react,react-dom/**}',
            group: 'builtin',
            position: 'before'
          },
          {
            pattern: '@src/**',
            group: 'parent',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        'newlines-between': 'always'
      }
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports'
      }
    ]
  }
}
