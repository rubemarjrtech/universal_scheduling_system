import globals from 'globals';
import neostandard from 'neostandard';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: ['dist', 'node_modules', '.eslint.config.mjs'],
  },
  ...neostandard({
    ts: true,
    noStyle: true,
  }),
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      rules: {
        'prettier/prettier': 'error',
      },
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: { allowDefaultProject: ['*.js', '*.mjs'] },
        tsConfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-useless-escape': 'off',
      'no-useless-return': 'off',
      'accessor-pairs': 'off',
      'lines-between-class-members': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
    },
  },
];
