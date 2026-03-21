import { render, screen } from "@testing-library/react";
import ImageCard from "@/app/ui/image/ImageCard";
import ImageGrid from "@/app/ui/image/ImageGrid";
import type { ImageDetails } from "@/app/models/ImageDetails";

jest.mock("../../../app/ui/image/ImageCard", () => ({
  __esModule: true,
  default: jest.fn(
    ({
      image,
      priority,
    }: {
      image: ImageDetails;
      priority: boolean;
    }) => (
      <div
        data-testid={`image-card-${image.id}`}
        data-priority={String(priority)}
      />
    ),
  ),
}));

const MockImageCard = ImageCard as unknown as jest.Mock;

function makeImage(id: string): ImageDetails {
  return {
    id,
    slug: id,
    alternative_slugs: {},
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    width: 800,
    height: 600,
    color: null,
    blur_hash: "test-blur",
    breadcrumbs: [],
    urls: {
      raw: "",
      full: "",
      regular: "",
      small: "",
      thumb: "",
      small_s3: "",
    },
    links: { self: "", html: "", download: "", download_location: "" },
    likes: 0,
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
        self: "",
        html: "",
        photos: "",
        likes: "",
        portfolio: "",
        following: "",
        followers: "",
      },
      profile_image: { small: "", medium: "", large: "" },
      total_collections: 0,
      total_likes: 0,
      total_photos: 0,
      total_promoted_photos: 0,
      accepted_tos: true,
      for_hire: false,
    },
  };
}

const baseProps = {
  activeMode: "photos" as const,
  activeUsername: "",
  onAuthorClick: jest.fn(),
  onCollectionsClick: jest.fn(),
  onLikesClick: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("ImageGrid", () => {
  it("renders an ImageCard for each image", () => {
    const images = [makeImage("a"), makeImage("b"), makeImage("c")];
    render(<ImageGrid {...baseProps} images={images} />);
    expect(screen.getAllByTestId(/^image-card-/)).toHaveLength(3);
  });

  it("renders nothing when images is empty", () => {
    render(<ImageGrid {...baseProps} images={[]} />);
    expect(screen.queryAllByTestId(/^image-card-/)).toHaveLength(0);
  });

  it("renders cards in the correct order", () => {
    const images = [makeImage("first"), makeImage("second"), makeImage("third")];
    render(<ImageGrid {...baseProps} images={images} />);
    const cards = screen.getAllByTestId(/^image-card-/);
    expect(cards[0]).toHaveAttribute("data-testid", "image-card-first");
    expect(cards[1]).toHaveAttribute("data-testid", "image-card-second");
    expect(cards[2]).toHaveAttribute("data-testid", "image-card-third");
  });

  describe("priority prop", () => {
    it("sets priority=true for the first 3 images", () => {
      const images = [makeImage("a"), makeImage("b"), makeImage("c"), makeImage("d")];
      render(<ImageGrid {...baseProps} images={images} />);
      expect(screen.getByTestId("image-card-a")).toHaveAttribute("data-priority", "true");
      expect(screen.getByTestId("image-card-b")).toHaveAttribute("data-priority", "true");
      expect(screen.getByTestId("image-card-c")).toHaveAttribute("data-priority", "true");
    });

    it("sets priority=false for images beyond the first 3", () => {
      const images = [makeImage("a"), makeImage("b"), makeImage("c"), makeImage("d")];
      render(<ImageGrid {...baseProps} images={images} />);
      expect(screen.getByTestId("image-card-d")).toHaveAttribute("data-priority", "false");
    });
  });

  it("passes activeMode and activeUsername to each ImageCard", () => {
    const images = [makeImage("a"), makeImage("b")];
    render(
      <ImageGrid
        {...baseProps}
        images={images}
        activeMode="likes"
        activeUsername="jane"
      />,
    );
    const calls = MockImageCard.mock.calls;
    expect(calls[0][0]).toMatchObject({ activeMode: "likes", activeUsername: "jane" });
    expect(calls[1][0]).toMatchObject({ activeMode: "likes", activeUsername: "jane" });
  });
});
