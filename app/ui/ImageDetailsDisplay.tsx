"use client";

import Link from "next/link";
import { ImageDetails } from "../models/ImageDetails";

type ImageDetailsDisplayProps = {
  image: ImageDetails;
};

/**
 * Renders the details of an image, including its description, creation date, author, tags, and source links.
 *
 * @component
 * @param {ImageDetailsDisplayProps} props - The component props.
 * @param {Image} props.image - The image object containing the details to be displayed.
 * @returns {JSX.Element} The rendered ImageDetailsDisplay component.
 */
const ImageDetailsDisplay = ({ image }: ImageDetailsDisplayProps) => {
  const {
    alt_description,
    description,
    created_at,
    tags,
    likes,
    user: { name, instagram_username, twitter_username },
    links: { html },
  } = image;

  const createdAt = new Date(created_at).toISOString().substring(0, 10);
  const displayDescription = alt_description || description || "No Description";
  const instagramLink = `https://www.instagram.com/${instagram_username}`;
  const twitterLink = `https://twitter.com/${twitter_username}`;

  return (
    <div className="grid grid-rows-1 text-center capitalize my-4 text-indigo-100 gap-1">
      {displayDescription && (
        <span className="my-4 italic font-bold text-indigo-50">
          {displayDescription}
        </span>
      )}
      <span>Created: {createdAt}</span>
      <span>By: {name}</span>
      <span>Tags: {tags?.map((tag) => tag.title).join(", ")}</span>
      {likes > 0 && <span>Likes: {likes}</span>}
      {instagram_username && (
        <Link
          href={instagramLink}
          rel="noopener noreferrer"
          target="_blank"
          className="hover:text-indigo-600 text-indigo-400"
        >
          Instagram
        </Link>
      )}
      {twitter_username && (
        <Link
          href={twitterLink}
          rel="noopener noreferrer"
          target="_blank"
          className="hover:text-indigo-600 text-indigo-400"
        >
          Twitter
        </Link>
      )}
      <Link
        href={html}
        rel="noopener noreferrer"
        target="_blank"
        className="hover:text-indigo-600 text-indigo-400"
      >
        Source
      </Link>
    </div>
  );
};

export default ImageDetailsDisplay;
