# Image Search

Image Search is a web application built with Next.js 15, React 19, and Tailwind CSS 4. It uses the Unsplash API to fetch and display images based on user queries, showcasing server-side API proxying, client-side state management, and responsive design.

**Live demo:** [image-search-black-iota.vercel.app](https://image-search-black-iota.vercel.app)

## Preview

![Lighthouse Score](./public/lighthouse_score.png)

## Features

- **Search:** Find images by keyword with paginated results.
- **Filter Buttons:** One-click preset categories (nature, space, travel, and more).
- **Pagination:** Navigate results across pages with previous/next buttons and a direct page jump input.
- **Image Grid:** Responsive grid layout (1 → 2 → 3 columns).
- **Image Details:** Each card shows description, upload date, author, tags, and social links.
- **PWA:** Installable as a Progressive Web App via the included web manifest.
- **SEO:** Metadata, Open Graph tags, sitemap, and robots configuration included.

## Technology Stack

- **Next.js 15** — App Router, server-side API proxy route, ISR caching
- **React 19** — Client components with hooks
- **Tailwind CSS 4** — Utility-first styling
- **TypeScript 5** — Strict mode enabled throughout
- **ESLint** — `next/core-web-vitals` + `@typescript-eslint/strict`
- **react-spinners** — Loading indicator

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/milliorn/image-search.git
   cd image-search
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env.local` file at the root of the project:

   ```env
   UNSPLASH_KEY=your_unsplash_access_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   - `UNSPLASH_KEY` — server-side only; never exposed to the browser
   - `NEXT_PUBLIC_SITE_URL` — used to generate the sitemap

4. Run the development server

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Start the development server with Turbopack |
| `npm run build`          | Build for production                        |
| `npm start`              | Start the production server                 |
| `npm run lint`           | Run ESLint                                  |
| `npm run lint:fix`       | Run ESLint with auto-fix                    |
| `npm run prettier:check` | Check formatting with Prettier              |
| `npm run prettier:fix`   | Auto-format with Prettier                   |

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License — see the LICENSE.md file for details.
