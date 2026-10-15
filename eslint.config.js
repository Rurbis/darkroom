// Shared ESLint configuration for the whole monorepo (flat config).
// Every app and package runs `eslint .` and inherits this file from the root.
import { builtinModules } from 'node:module';

import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const nodeOnlyMessage = '@focaldrop/shared must run in the browser and in Workers: use a web API.';

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/.next/',
    '**/.open-next/',
    '**/.turbo/',
    '**/.wrangler/',
    '**/coverage/',
    '**/next-env.d.ts',
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
      // `const { slug, ...rest } = obj` is the idiomatic way to omit a key.
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    // @focaldrop/shared runs in the browser, in Nest and in the Worker (Phase 2 §2):
    // only web-standard APIs are allowed.
    files: ['packages/shared/src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: builtinModules.map((name) => ({ name, message: nodeOnlyMessage })),
          patterns: [{ group: ['node:*'], message: nodeOnlyMessage }],
        },
      ],
      'no-restricted-globals': [
        'error',
        ...['process', 'Buffer', 'global', '__dirname', '__filename', 'require'].map((name) => ({
          name,
          message: nodeOnlyMessage,
        })),
      ],
    },
  },
  {
    // Next.js and React hooks rules for the web app. eslint-config-next is not used:
    // it pulls eslint-plugin-react and eslint-plugin-import, which do not support
    // ESLint 10 yet (D115). jsx-a11y joins when it does.
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: [nextPlugin.configs['core-web-vitals'], reactHooks.configs.flat.recommended],
    languageOptions: {
      globals: { ...globals.browser },
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
