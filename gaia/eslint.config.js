import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: {...globals.browser, ...globals.node} }
  },
  tseslint.configs.recommended,
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      "no-unused-vars": "error",
      "@stylistic/indent": ["error", 2],
      "@stylistic/max-len": ["error", 120],
    },
  }
]);
