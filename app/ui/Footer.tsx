/** Renders the site footer with a dynamic copyright year and a link to the author's GitHub. */

import Link from "next/link";
import type { JSX } from "react";

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
