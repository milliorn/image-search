/** Renders a responsive grid of ImageCard components from a list of Unsplash photos. */

"use client";

import type { ImageGridProps } from "@/app/models/ImageProps";
import ImageCard from "./ImageCard";
import type { JSX } from "react";

/** Maps each photo in the results array to an ImageCard keyed by the Unsplash photo ID. */
const ImageGrid = ({ images }: ImageGridProps): JSX.Element => {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};

export default ImageGrid;
