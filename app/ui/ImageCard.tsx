"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageDetails } from "../models/ImageDetails";
import ImageDetailsDisplay from "./ImageDetailsDisplay";

type ImageCardProps = {
  image: ImageDetails;
};

/**
 * Renders a card component for displaying an image.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Image} props.image - The image object to be displayed.
 * @returns {JSX.Element} The rendered ImageCard component.
 */
const ImageCard = ({ image }: ImageCardProps): JSX.Element => {
  return (
    <div className="text-center capitalize my-4 text-indigo-100" key={image.id}>
      <Link href={image.links.html} rel="noopener noreferrer" target="_blank">
        <Image
          alt={image.alt_description || "image"}
          blurDataURL={image.blur_hash}
          className="rounded shadow-lg my-4 mx-auto border border-indigo-200"
          height={image.height as number}
          key={image.id}
          placeholder="blur"
          src={image.urls.regular}
          width={image.width as number}
          onError={(e) => console.error(`Failed to load image: ${e.target}`)}
        />
      </Link>
      <ImageDetailsDisplay image={image} />
    </div>
  );
};

export default ImageCard;
