"use client";

export type ImageDetails = {
  alt_description?: string;
  blur_hash: string;
  description: string;
  height: number | `${number}` | undefined;
  id: string;
  likes: number;
  urls: {
    small: string;
  };
  width: number | `${number}` | undefined;
};
