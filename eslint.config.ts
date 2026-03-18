/** ESLint flat config extending Next.js core web vitals and strict TypeScript rules. */

import nextConfig from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
  {
    // Exclude generated and compiled output from linting.
    ignores: ["node_modules/**", ".next/**", "next-env.d.ts"],
  },
  ...nextConfig,
  ...tseslint.configs.strict,
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
