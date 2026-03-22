import { render, screen } from "@testing-library/react";
import ImageCard from "@/app/ui/image/ImageCard";
import ImageGrid from "@/app/ui/image/ImageGrid";
import type { ImageDetails } from "@/app/models/ImageDetails";
import { makeImage } from "../../fixtures/makeImage";

jest.mock("../../../app/ui/image/ImageCard", () => ({
  __esModule: true,
  default: jest.fn(
    ({ image, priority }: { image: ImageDetails; priority: boolean }) => (
      <div
        data-testid={`image-card-${image.id}`}
        data-priority={String(priority)}
      />
    ),
  ),
}));

const MockImageCard = ImageCard as unknown as jest.Mock;

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
    const images = [
      makeImage({ id: "a" }),
      makeImage({ id: "b" }),
      makeImage({ id: "c" }),
    ];
    
    render(<ImageGrid {...baseProps} images={images} />);
    expect(screen.getAllByTestId(/^image-card-/)).toHaveLength(3);
  });

  it("renders nothing when images is empty", () => {
    render(<ImageGrid {...baseProps} images={[]} />);
    expect(screen.queryAllByTestId(/^image-card-/)).toHaveLength(0);
  });

  it("renders cards in the correct order", () => {
    const images = [
      makeImage({ id: "first" }),
      makeImage({ id: "second" }),
      makeImage({ id: "third" }),
    ];

    render(<ImageGrid {...baseProps} images={images} />);

    const cards = screen.getAllByTestId(/^image-card-/);

    expect(cards[0]).toHaveAttribute("data-testid", "image-card-first");
    expect(cards[1]).toHaveAttribute("data-testid", "image-card-second");
    expect(cards[2]).toHaveAttribute("data-testid", "image-card-third");
  });

  describe("priority prop", () => {
    it("sets priority=true for the first 3 images", () => {
      const images = [
        makeImage({ id: "a" }),
        makeImage({ id: "b" }),
        makeImage({ id: "c" }),
        makeImage({ id: "d" }),
      ];

      render(<ImageGrid {...baseProps} images={images} />);

      expect(screen.getByTestId("image-card-a")).toHaveAttribute(
        "data-priority",
        "true",
      );
      expect(screen.getByTestId("image-card-b")).toHaveAttribute(
        "data-priority",
        "true",
      );
      expect(screen.getByTestId("image-card-c")).toHaveAttribute(
        "data-priority",
        "true",
      );
    });

    it("sets priority=false for images beyond the first 3", () => {
      const images = [
        makeImage({ id: "a" }),
        makeImage({ id: "b" }),
        makeImage({ id: "c" }),
        makeImage({ id: "d" }),
      ];

      render(<ImageGrid {...baseProps} images={images} />);
      expect(screen.getByTestId("image-card-d")).toHaveAttribute(
        "data-priority",
        "false",
      );
    });
  });

  it("passes activeMode and activeUsername to each ImageCard", () => {
    const images = [makeImage({ id: "a" }), makeImage({ id: "b" })];
    render(
      <ImageGrid
        {...baseProps}
        images={images}
        activeMode="likes"
        activeUsername="jane"
      />,
    );
    const calls = MockImageCard.mock.calls;

    expect(calls[0][0]).toMatchObject({
      activeMode: "likes",
      activeUsername: "jane",
    });
    
    expect(calls[1][0]).toMatchObject({
      activeMode: "likes",
      activeUsername: "jane",
    });
  });
});
