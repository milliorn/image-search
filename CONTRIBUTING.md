# Contributing

Thank you for your interest in contributing to Image Search. This document covers how to set up the project locally, the conventions used throughout the codebase, and how to submit changes.

## Prerequisites

- Node.js 20 or later
- npm
- An [Unsplash developer account](https://unsplash.com/developers) with a registered application (for the API key)

## Setup

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/image-search.git
   cd image-search
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file at the project root and add your Unsplash key:

   ```
   UNSPLASH_KEY=your_access_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Making Changes

### Branching

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

Use `fix/` for bug fixes and `chore/` for non-functional changes.

### Code Conventions

- **Exports**: Do not use inline `export` keywords. Collect all exports in a grouped statement at the bottom of the file (`export { Foo, Bar }` or `export type { Foo, Bar }`). Components use `export default ComponentName` at the bottom.
- **Types**: Keep types in separate model files under `app/models/`. Group related types in one file rather than creating one file per type. Do not add `"use client"` to type or constants files.
- **Route handlers**: Define a named function, then export it at the bottom (`export { GET }`).
- **Comments**: Only add comments where the logic is not self-evident. Do not add JSDoc `{Type}` annotations; TypeScript types cover it.
- **Simplicity**: Avoid premature abstractions. Inline simple single-use logic rather than extracting it into a helper.

### Linting and Formatting

This project uses ESLint (with `next/core-web-vitals` and `typescript-eslint` strict rules) and Prettier. Before committing, run:

```bash
npm run lint
npm run prettier:check
```

Auto-fix commands are also available:

```bash
npm run lint:fix
npm run prettier:fix
```

## Testing

Tests live in `__tests__/` and are split into three suites:

| Suite | Command | Covers |
|---|---|---|
| Unit | `npm run test:unit` | Pure functions and utilities |
| Components | `npm run test:components` | React component rendering and interaction |
| Integration | `npm run test:integration` | API route handlers and multi-component flows |

Run all suites at once:

```bash
npm test
```

Run in watch mode during development:

```bash
npm run test:watch
```

Generate a coverage report:

```bash
npm run test:coverage
```

All tests must pass and linting must be clean before opening a pull request.

## Submitting a Pull Request

1. Ensure `npm run lint`, `npm run prettier:check`, and `npm test` all pass.
2. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a pull request against the `main` branch of this repository.
4. Fill in the pull request description with a summary of what changed and why.

Pull requests are reviewed on a best-effort basis. Small, focused PRs are easier to review and more likely to be merged quickly.

## Reporting Issues

Open an issue and include:

- A clear description of the problem or proposed improvement
- Steps to reproduce (for bugs)
- The expected behavior and what actually happened
- Your Node.js version and browser, if relevant

## License

By contributing you agree that your changes will be licensed under the [MIT License](LICENSE.md) that covers this project.
