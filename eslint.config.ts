import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { Linter } from "eslint";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({ baseDirectory: dirname });

const config: Linter.Config[] = [
  {
    ignores: ["node_modules/**", ".next/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "plugin:@typescript-eslint/strict"),
  {
    rules: {
      eqeqeq: ["error", "always"],
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "no-var": "error",
      curly: "error",
    },
  },
];

export default config;
