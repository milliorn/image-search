import type { ImageDetails } from "./ImageDetails";

type ApiResponse = {
  message?: string;
  results?: ImageDetails[];
  total_pages?: number;
};

export type { ApiResponse };
