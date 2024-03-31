"use client";

import ImageCard from "./ImageCard";
import { ImageDetails } from "../../models/ImageDetails";

type ImageGridProps = {
  images: ImageDetails[];
};

/**
 * Renders a grid of image cards.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Image[]} props.images - The array of image objects to be displayed.
 * @returns {JSX.Element} The rendered ImageGrid component.
 */
const ImageGrid = ({ images }: ImageGridProps): JSX.Element => {
  return (
    <div className="grid grid-rows-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};

export default ImageGrid;
