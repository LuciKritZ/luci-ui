import { FlatCompat } from "@eslint/eslintrc";
import perfectionist from "eslint-plugin-perfectionist";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "scratch/**",
      "next-env.d.ts",
      "types/globals.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  perfectionist.configs["recommended-natural"],
];

export default eslintConfig;
