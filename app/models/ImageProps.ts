import type { ImageDetails } from "./ImageDetails";

/** Props types for image display components: ImageCard, ImageDetailsDisplay, and ImageGrid. */
type ImageCardProps = {
  activeUsername: string;
  image: ImageDetails;
  onAuthorClick: (username: string) => void;
  priority: boolean;
};

type ImageDetailsDisplayProps = {
  activeUsername: string;
  image: ImageDetails;
  onAuthorClick: (username: string) => void;
};

type ImageGridProps = {
  activeUsername: string;
  images: ImageDetails[];
  onAuthorClick: (username: string) => void;
};

export type { ImageCardProps, ImageDetailsDisplayProps, ImageGridProps };
