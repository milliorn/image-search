# Image Search

Image Search is a powerful web application built using Next.js 14, React 18, and TailwindCSS. It utilizes the Unsplash API to fetch and display a wide array of images based on user queries. This project is designed to showcase modern web development techniques, including server-side rendering, client-side state management, and responsive design.

## Features

- Search Functionality: Users can search for images using keywords, with instant loading of results.
- Filter Options: Users can filter search results based on predefined categories.
- Pagination Controls: Navigate through search results across multiple pages.
- Image Grid Display: Images are presented in a responsive grid layout.
- Image Details: Clicking on an image reveals detailed information including description, tags, and a link to the source.
- Progressive Web App (PWA): The application is installable as a PWA with offline capabilities.
- SEO Optimized: Metadata, sitemap, and robots configuration are optimized for search engines.

## Technology Stack

- Next.js 14: Framework for server-rendered React applications.
- React 18: Library for building user interfaces.
- TailwindCSS: Utility-first CSS framework for rapid UI development.
- TypeScript: Used for static type checking.
- ESLint: Linter tool for identifying and reporting on patterns in JavaScript.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To get started with Image Search, follow these steps:

1. Clone the repository

```bash
git clone https://github.com/your-github-username/image-search.git
cd image-search
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a .env.local file at the root of your project and add the necessary API keys and environment-specific variables.

```
UNSPLASH_KEY=your_unsplash_access_key_here
```
4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. Your Image Search app should now be running.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Contributing

Contributions to improve Image Search are welcome. Please follow these steps to contribute:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Commit your changes (git commit -am 'Add some feature').
- Push to the branch (git push origin feature-branch).
- Create a new Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
