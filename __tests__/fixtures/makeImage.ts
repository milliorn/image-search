import type { ImageDetails } from "@/app/models/ImageDetails";

function makeImage(overrides: Partial<ImageDetails> = {}): ImageDetails {
  return {
    id: "test-id",
    slug: "test-slug",
    alternative_slugs: {},
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-03-15T00:00:00Z",
    width: 800,
    height: 600,
    color: "#123456",
    blur_hash: "test-blur",
    breadcrumbs: [],
    urls: {
      raw: "https://example.com/raw.jpg",
      full: "https://example.com/full.jpg",
      regular: "https://example.com/regular.jpg",
      small: "https://example.com/small.jpg",
      thumb: "https://example.com/thumb.jpg",
      small_s3: "https://example.com/small_s3.jpg",
    },
    links: {
      self: "https://api.unsplash.com/photos/test-id",
      html: "https://unsplash.com/photos/test-id",
      download: "https://unsplash.com/photos/test-id/download",
      download_location: "https://api.unsplash.com/photos/test-id/download",
    },
    likes: 42,
    liked_by_user: false,
    topic_submissions: {},
    asset_type: "photo",
    user: {
      id: "user-id",
      updated_at: "2024-03-15T00:00:00Z",
      username: "testuser",
      name: "Test User",
      first_name: "Test",
      links: {
        self: "https://api.unsplash.com/users/testuser",
        html: "https://unsplash.com/@testuser",
        photos: "https://api.unsplash.com/users/testuser/photos",
        likes: "https://api.unsplash.com/users/testuser/likes",
        portfolio: "https://api.unsplash.com/users/testuser/portfolio",
        following: "https://api.unsplash.com/users/testuser/following",
        followers: "https://api.unsplash.com/users/testuser/followers",
      },
      profile_image: {
        small: "https://example.com/profile-small.jpg",
        medium: "https://example.com/profile-medium.jpg",
        large: "https://example.com/profile-large.jpg",
      },
      total_collections: 0,
      total_likes: 0,
      total_photos: 0,
      total_promoted_photos: 0,
      accepted_tos: true,
      for_hire: false,
    },
    alt_description: "a test image",
    ...overrides,
  };
}

export { makeImage };
