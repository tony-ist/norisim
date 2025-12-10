import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js, react, stylistic }, 
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  stylistic.configs.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': "off",
      'stylistic/semi': ['error', 'always'],
    }
  },
  globalIgnores(["**/dist/**", "**/node_modules/**", '.eslintrc.cjs']),
]);
