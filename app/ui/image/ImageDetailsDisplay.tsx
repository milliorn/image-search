/** Renders metadata for a single image: description, date, author, and social links. */

"use client";

import Link from "next/link";
import type { JSX } from "react";
import type { ImageDetailsDisplayProps } from "@/app/models/ImageProps";

/** Extracts and displays photo metadata from the Unsplash API response. */
const ImageDetailsDisplay = ({
  image,
}: ImageDetailsDisplayProps): JSX.Element => {
  const {
    alt_description,
    description,
    created_at,
    likes,
    user: { name, location, portfolio_url, instagram_username, twitter_username, links: { html: authorUrl } },
    links: { html },
  } = image;

  const dateObj = new Date(created_at);
  const createdAt = isNaN(dateObj.getTime())
    ? "Unknown"
    : dateObj.toISOString().substring(0, 10);
  const displayDescription = alt_description || description || "No Description";

  return (
    <div className="grid grid-rows-1 text-center capitalize my-4 text-indigo-100 gap-1">
      <span className="my-4 italic font-bold text-indigo-50">
        {displayDescription}
      </span>

      <span>Created: {createdAt}</span>
      <span>
        By:{" "}
        <Link
          className="hover:text-indigo-600 text-indigo-400"
          href={authorUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {name}
        </Link>
      </span>
      {location && <span>Location: {location}</span>}
      {likes > 0 && <span>Likes: {likes}</span>}

      <div className="grid grid-rows-1 gap-1 mt-4">
        Links:
        {instagram_username && (
          <Link
            className="hover:text-indigo-600 text-indigo-400"
            href={`https://www.instagram.com/${instagram_username}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Instagram
          </Link>
        )}
        {twitter_username && (
          <Link
            className="hover:text-indigo-600 text-indigo-400"
            href={`https://twitter.com/${twitter_username}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Twitter
          </Link>
        )}
        {portfolio_url && (
          <Link
            className="hover:text-indigo-600 text-indigo-400"
            href={portfolio_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Portfolio
          </Link>
        )}
        <Link
          className="hover:text-indigo-600 text-indigo-400"
          href={html}
          rel="noopener noreferrer"
          target="_blank"
        >
          Source
        </Link>
      </div>
    </div>
  );
};

export default ImageDetailsDisplay;
