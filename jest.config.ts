import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Replace next/link with a plain <a> tag to avoid Next.js router setup in tests.
    "^next/link$": "<rootDir>/__mocks__/next/link.tsx",
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/__tests__/fixtures/"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/models/**", // pure type declarations, no runtime logic
    "!app/layout.tsx", // Next.js root layout, no testable logic
    "!app/manifest.ts", // static manifest, no testable logic
    "!app/robots.ts", // static robots config, no testable logic
    "!app/sitemap.ts", // static sitemap config, no testable logic
  ],
};

export default createJestConfig(config);
