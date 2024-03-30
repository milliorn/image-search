// ImageDetailsDisplay.tsx

import Link from "next/link";
import { ImageDetails } from "../models/ImageDetails";

type ImageDetailsDisplayProps = {
  image: ImageDetails;
};

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
  const displayDescription = alt_description || description;
  const instagramLink = `https://www.instagram.com/${instagram_username}`;
  const twitterLink = `https://twitter.com/${twitter_username}`;

  return (
    <div>
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
