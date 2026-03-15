import Link from "next/link";
import type { JSX } from "react";

const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-4 font-bold text-indigo-800 dark:text-indigo-200">
      <p>
        © {currentYear}{" "}
        <Link
          href="https://github.com/milliorn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">
            Scott Milliorn
          </span>
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
