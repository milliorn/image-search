"use client";

import Link from "next/link";

/**
 * Represents the footer of the application.
 * @returns {JSX.Element} The footer of the application.
 */
const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-4 font-bold text-indigo-200">
      <p>
        © {currentYear}{" "}
        <Link
          href="https://github.com/milliorn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-indigo-400 hover:text-indigo-600 ">
            Scott Milliorn
          </span>
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
