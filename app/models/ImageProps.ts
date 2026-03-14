import type { ImageDetails } from "./ImageDetails";

/** Props types for image display components: ImageCard, ImageDetailsDisplay, and ImageGrid. */
type ImageCardProps = {
  image: ImageDetails;
  onAuthorClick: (username: string) => void;
  priority: boolean;
};

type ImageDetailsDisplayProps = {
  image: ImageDetails;
  onAuthorClick: (username: string) => void;
};

type ImageGridProps = {
  images: ImageDetails[];
  onAuthorClick: (username: string) => void;
};

export type { ImageCardProps, ImageDetailsDisplayProps, ImageGridProps };
