/** Renders metadata for a single image: description, date, author, tags, and social links. */

"use client";

import type { ImageDetailsDisplayProps } from "@/app/models/ImageProps";
import type { JSX } from "react";
import Link from "next/link";

/** Extracts and displays photo metadata from the Unsplash API response. */
const ImageDetailsDisplay = ({
  image,
}: ImageDetailsDisplayProps): JSX.Element => {
  const {
    alt_description,
    description,
    created_at,
    tags,
    likes,
    user: { name, instagram_username, twitter_username },
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
      <span>By: {name}</span>
      {likes > 0 && <span>Likes: {likes}</span>}

      <span className="grid grid-rows-1 gap-1 mt-4">
        Tags:
        {tags?.map((tag, index) => (
          <div key={index}>
            <Link
              className="hover:text-indigo-600 text-indigo-400"
              href={`https://unsplash.com/s/photos/${tag.title}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {tag.title}
            </Link>
          </div>
        ))}
      </span>

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
