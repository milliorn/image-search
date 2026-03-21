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
    "^next/link$": "<rootDir>/__mocks__/next/link.tsx",
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/__tests__/fixtures/"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/models/**",
    "!app/layout.tsx",
    "!app/manifest.ts",
    "!app/robots.ts",
    "!app/sitemap.ts",
  ],
};

export default createJestConfig(config);
