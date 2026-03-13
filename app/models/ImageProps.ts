/** Props types for image display components: ImageCard, ImageDetailsDisplay, and ImageGrid. */

import type { ImageDetails } from "./ImageDetails";

type ImageCardProps = {
  image: ImageDetails;
  priority: boolean;
};

type ImageDetailsDisplayProps = {
  image: ImageDetails;
};

type ImageGridProps = {
  images: ImageDetails[];
};

export type { ImageCardProps, ImageDetailsDisplayProps, ImageGridProps };
