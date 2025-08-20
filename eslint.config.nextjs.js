import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      // Build outputs
      'dist/**',
      '.next/**',
      '.netlify/**',

      // Dependencies
      'node_modules/**',

      // Coverage reports
      'coverage/**',

      // Environment files
      '.env*',
      '!.env.example',

      // Logs
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',

      // Runtime data
      'pids',
      '*.pid',
      '*.seed',
      '*.pid.lock',

      // Optional npm cache directory
      '.npm',

      // Optional eslint cache
      '.eslintcache',

      // Microbundle cache
      '.rpt2_cache/**',
      '.rts2_cache_cjs/**',
      '.rts2_cache_es/**',
      '.rts2_cache_umd/**',

      // Optional REPL history
      '.node_repl_history',

      // Output of 'npm pack'
      '*.tgz',

      // Yarn Integrity file
      '.yarn-integrity',

      // parcel-bundler cache
      '.cache',
      '.parcel-cache',

      // nuxt.js build output
      '.nuxt',

      // vuepress build output
      '.vuepress/dist',

      // Serverless directories
      '.serverless/**',

      // FuseBox cache
      '.fusebox/**',

      // DynamoDB Local files
      '.dynamodb/**',

      // TernJS port file
      '.tern-port',
    ],
  },
  js.configs.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
        React: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactRefreshPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
        React: 'readonly',
      },
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactRefreshPlugin.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off',
    },
  },
];
