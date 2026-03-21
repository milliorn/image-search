import { fireEvent, render, screen } from "@testing-library/react";
import Image from "next/image";
import ImageCard from "@/app/ui/image/ImageCard";
import type { ImageDetails } from "@/app/models/ImageDetails";

jest.mock("next/image", () => ({
  __esModule: true,
  default: jest.fn(
    ({
      src,
      alt,
      onError,
    }: {
      src: string;
      alt: string;
      onError?: () => void;
    // eslint-disable-next-line @next/next/no-img-element
    }) => <img src={src} alt={alt} onError={onError} />,
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: jest.fn(
    ({
      href,
      children,
    }: {
      href: string;
      children: React.ReactNode;
    }) => <a href={href}>{children}</a>,
  ),
}));

jest.mock("../../../app/ui/image/ImageDetailsDisplay", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="image-details-display" />),
}));

const MockImage = Image as unknown as jest.Mock;

function makeImage(overrides: Partial<ImageDetails> = {}): ImageDetails {
  return {
    id: "test-id",
    slug: "test-slug",
    alternative_slugs: {},
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
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
      updated_at: "2024-01-01T00:00:00Z",
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

const baseProps = {
  activeMode: "photos" as const,
  activeUsername: "",
  image: makeImage(),
  onAuthorClick: jest.fn(),
  onCollectionsClick: jest.fn(),
  onLikesClick: jest.fn(),
  priority: false,
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("ImageCard", () => {
  it("renders the image with alt_description", () => {
    render(<ImageCard {...baseProps} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      baseProps.image.alt_description,
    );
  });

  it("falls back to 'image' when alt_description is falsy", () => {
    render(
      <ImageCard {...baseProps} image={makeImage({ alt_description: "" })} />,
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", "image");
  });

  it("uses urls.regular as the image src", () => {
    render(<ImageCard {...baseProps} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      baseProps.image.urls.regular,
    );
  });

  it("wraps the image in a link to links.html", () => {
    render(<ImageCard {...baseProps} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      baseProps.image.links.html,
    );
  });

  it("passes priority to Image", () => {
    render(<ImageCard {...baseProps} priority={true} />);
    expect(MockImage.mock.calls[0][0]).toHaveProperty("priority", true);
  });

  it("renders ImageDetailsDisplay", () => {
    render(<ImageCard {...baseProps} />);
    expect(screen.getByTestId("image-details-display")).toBeInTheDocument();
  });

  describe("image load error", () => {
    it("shows error message when image fails to load", () => {
      render(<ImageCard {...baseProps} />);
      fireEvent.error(screen.getByRole("img"));
      expect(screen.getByText("Image failed to load.")).toBeInTheDocument();
    });

    it("removes the image after load error", () => {
      render(<ImageCard {...baseProps} />);
      fireEvent.error(screen.getByRole("img"));
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });
});
