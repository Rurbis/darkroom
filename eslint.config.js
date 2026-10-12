// Shared ESLint configuration for the whole monorepo (flat config).
// Every app and package runs `eslint .` and inherits this file from the root.
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/.next/',
    '**/.open-next/',
    '**/.turbo/',
    '**/.wrangler/',
    '**/coverage/',
  ]),
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        // Type-aware linting: each file is checked with its nearest tsconfig.json.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // A forgotten `await` is the most common bug in Nest services.
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    // Plain JavaScript files (configs, scripts) are linted without type information.
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  // Must stay last: turns off the stylistic rules that Prettier owns.
  prettier,
]);
