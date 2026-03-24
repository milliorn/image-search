"use client";

/** Renders metadata for a single image: description, date, author, location, likes, social links, and navigation buttons to the author's photos, likes, and collections. */

import Link from "next/link";
import type { JSX } from "react";
import type { ImageDetailsDisplayProps } from "@/app/models/ImageProps";

/** Navigation buttons (photos, likes, collections) are hidden when the active view already shows that mode for this author. */
const ImageDetailsDisplay = ({
  activeMode,
  activeUsername,
  image,
  onAuthorClick,
  onCollectionsClick,
  onLikesClick,
}: ImageDetailsDisplayProps): JSX.Element => {
  const {
    alt_description,
    description,
    created_at,
    likes,
    user: {
      name,
      username,
      location,
      total_collections,
      portfolio_url,
      instagram_username,
      twitter_username,
      links: { html: authorUrl },
    },
    links: { html },
  } = image;

  const dateObj = new Date(created_at);
  const createdAt = isNaN(dateObj.getTime())
    ? "Unknown"
    : dateObj.toISOString().substring(0, 10);

  const displayDescription = alt_description || description || "No Description";

  return (
    <div className="grid grid-rows-1 text-center capitalize my-4 text-indigo-900 dark:text-indigo-100 gap-1">
      <span className="my-4 italic font-bold text-indigo-950 dark:text-indigo-50">
        {displayDescription}
      </span>

      <span>Created: {createdAt}</span>
      <span>
        By:{" "}
        <Link
          className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
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
            className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            href={`https://www.instagram.com/${instagram_username}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Instagram
          </Link>
        )}
        {twitter_username && (
          <Link
            className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            href={`https://twitter.com/${twitter_username}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Twitter
          </Link>
        )}
        {portfolio_url && (
          <Link
            className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
            href={portfolio_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Portfolio
          </Link>
        )}
        <Link
          className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600"
          href={html}
          rel="noopener noreferrer"
          target="_blank"
        >
          Source
        </Link>
        {!(activeUsername === username && activeMode === "photos") && (
          <button
            className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 cursor-pointer"
            onClick={() => onAuthorClick(username)}
          >
            See More Photos by {name}
          </button>
        )}
        {!(activeUsername === username && activeMode === "likes") && (
          <button
            className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 cursor-pointer"
            onClick={() => onLikesClick(username)}
          >
            Liked Photos by {name}
          </button>
        )}
        {total_collections > 0 &&
          !(activeUsername === username && activeMode === "collections") && (
            <button
              className="text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 cursor-pointer"
              onClick={() => onCollectionsClick(username)}
            >
              Collections by {name}
            </button>
          )}
      </div>
    </div>
  );
};

export default ImageDetailsDisplay;
