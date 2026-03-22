import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import prettierPlugin from "eslint-plugin-prettier";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      "no-unused-vars": ["off"], // Turn off the no-unused-vars rule
      "@typescript-eslint/no-unused-vars": "warn", // Also turn off the TypeScript version of the rule
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "prettier/prettier": 0,
      // "sort-imports": [
      //   "error",
      //   {
      //     ignoreCase: false,
      //     ignoreDeclarationSort: false,
      //     ignoreMemberSort: false,
      //     memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      //     allowSeparatedGroups: false,
      //   },
      // ],
    },
  },
];

export default eslintConfig;
