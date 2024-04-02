import { ImageDetails } from "../ImageDetails";

type ImageCardProps = {
  image: ImageDetails;
};

type ImageDetailsDisplayProps = {
  image: ImageDetails;
};

type ImageGridProps = {
  images: ImageDetails[];
};

export type { ImageCardProps, ImageDetailsDisplayProps, ImageGridProps };