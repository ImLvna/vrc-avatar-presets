import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import parser from 'svelte-eslint-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

/**
 * @type {import("@eslint/eslintrc").ESLintConfig}
 */
export default [
  {
    ignores: ['**/node_modules', '**/dist', '**/out', '**/.gitignore']
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:svelte/recommended',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ),
  {
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        extraFileExtensions: ['.svelte']
      }
    },

    rules: {
      'svelte/no-unused-svelte-ignore': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  {
    files: ['**/*.svelte'],

    languageOptions: {
      parser: parser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  }
]
