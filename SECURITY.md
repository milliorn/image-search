# Security Policy

## Supported Versions

This project is in active development. Only the latest commit on `main` receives security updates.

| Version         | Supported |
| --------------- | --------- |
| latest (`main`) | Yes       |
| older commits   | No        |

## Scope

This is a Next.js application that proxies the [Unsplash API](https://unsplash.com/developers). The attack surface is limited to:

- **API route handlers** (`/app/api/`) - server-side proxies that forward requests to Unsplash
- **Environment variables** - the Unsplash access key (`NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` or equivalent) must not be exposed
- **Dependencies** - `next`, `react`, `react-spinners`, and their transitive dependencies

This project does not have a database, user authentication, or persistent storage.

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

Instead, report them via [GitHub's private vulnerability reporting](../../security/advisories/new) for this repository. Include:

- A description of the vulnerability and its potential impact
- Steps to reproduce
- Any suggested mitigations

You can expect an initial response within a few days. If the vulnerability is confirmed, a fix will be prioritized and you will be credited in the release notes unless you prefer otherwise. If it is declined, a brief explanation will be provided.
