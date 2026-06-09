import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['styled-system/**', '.output/**', '.vinxi/**', 'dist/**', '.tanstack/**'],
  },
  // Must stay last: disables ESLint stylistic rules that conflict with Prettier.
  eslintConfigPrettier,
)
