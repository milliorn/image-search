import { fireEvent, render, screen } from "@testing-library/react";
import Image from "next/image";
import ImageCard from "@/app/ui/image/ImageCard";
import { makeImage } from "../../fixtures/makeImage";

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

jest.mock("../../../app/ui/image/ImageDetailsDisplay", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="image-details-display" />),
}));

const MockImage = Image as unknown as jest.Mock;

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

  it("passes undefined backgroundColor when image color is null", () => {
    render(
      <ImageCard
        {...baseProps}
        image={makeImage({ color: null as unknown as string })}
      />,
    );

    expect(MockImage.mock.calls[0][0]).toHaveProperty("style", {
      backgroundColor: undefined,
    });
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
