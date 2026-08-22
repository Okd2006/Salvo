// eslint.config.js — ESLint v9 flat config
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/** Node.js globals — process, console, etc. */
const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores MUST be the first item in flat config
  {
    ignores: ['dist/**', 'node_modules/**', 'stitch_html/**', 'stitch_images/**', 'stitch_output/**', 'stitch_src/**', '*.html', 'scripts/*.js'],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript source files — full type-aware linting
  {
    files: ['src/agents/**/*.ts', 'src/lib/**/*.ts', 'src/types/**/*.ts', 'src/index.ts', 'scripts/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: nodeGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Inherit TS recommended (without the most aggressive unsafe rules)
      ...tsPlugin.configs['recommended'].rules,

      // Strict typing — errors
      '@typescript-eslint/no-explicit-any': 'warn',       // SDK boundaries require any
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'warn',
      // Unsafe member access: warn (not error) at SDK/Razorpay any boundaries
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',

      // Style
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },

  // UI files — no type-aware linting (tsconfig excludes src/ui; Vite handles that separately)
  {
    files: ['src/ui/**/*.ts', 'src/ui/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        // No `project` — src/ui is excluded from tsconfig intentionally
      },
      globals: {
        ...nodeGlobals,
        window: 'readonly',
        document: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        WebGLRenderingContext: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },

  // Prettier must be last — disables formatting rules
  prettier,
];
