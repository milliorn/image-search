import type { ImageDetails } from "./ImageDetails";

/** Props types for image display components: ImageCard, ImageDetailsDisplay, and ImageGrid. */
type ImageCardProps = {
  activeUsername: string;
  activeMode: "photos" | "likes";
  image: ImageDetails;
  onAuthorClick: (username: string) => void;
  onLikesClick: (username: string) => void;
  priority: boolean;
};

type ImageDetailsDisplayProps = {
  activeUsername: string;
  activeMode: "photos" | "likes";
  image: ImageDetails;
  onAuthorClick: (username: string) => void;
  onLikesClick: (username: string) => void;
};

type ImageGridProps = {
  activeUsername: string;
  activeMode: "photos" | "likes";
  images: ImageDetails[];
  onAuthorClick: (username: string) => void;
  onLikesClick: (username: string) => void;
};

export type { ImageCardProps, ImageDetailsDisplayProps, ImageGridProps };
