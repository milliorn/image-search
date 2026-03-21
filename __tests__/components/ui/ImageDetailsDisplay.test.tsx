import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageDetailsDisplay from "@/app/ui/image/ImageDetailsDisplay";
import { makeImage } from "../../fixtures/makeImage";

const onAuthorClick = jest.fn();
const onLikesClick = jest.fn();
const onCollectionsClick = jest.fn();

const baseProps = {
  activeMode: "photos" as const,
  activeUsername: "other-user",
  image: makeImage(),
  onAuthorClick,
  onLikesClick,
  onCollectionsClick,
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("ImageDetailsDisplay", () => {
  describe("description", () => {
    it("shows alt_description when present", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(screen.getByText("a test image")).toBeInTheDocument();
    });

    it("falls back to description when alt_description is falsy", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          image={makeImage({
            alt_description: "",
            description: "A beautiful scene",
          })}
        />,
      );
      expect(screen.getByText("A beautiful scene")).toBeInTheDocument();
    });

    it("falls back to 'No Description' when both are falsy", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          image={makeImage({ alt_description: "", description: "" })}
        />,
      );
      expect(screen.getByText("No Description")).toBeInTheDocument();
    });
  });

  describe("date", () => {
    it("formats created_at as YYYY-MM-DD", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(screen.getByText("Created: 2024-03-15")).toBeInTheDocument();
    });

    it("shows 'Unknown' for an invalid date", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          image={makeImage({ created_at: "not-a-date" })}
        />,
      );
      expect(screen.getByText("Created: Unknown")).toBeInTheDocument();
    });
  });

  describe("author", () => {
    it("shows the author name", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("links to the author's Unsplash profile", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(screen.getByRole("link", { name: "Test User" })).toHaveAttribute(
        "href",
        baseProps.image.user.links.html,
      );
    });
  });

  describe("location", () => {
    it("shows location when present", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          image={makeImage({
            user: { ...makeImage().user, location: "Paris" },
          })}
        />,
      );
      expect(screen.getByText("Location: Paris")).toBeInTheDocument();
    });

    it("hides location when absent", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(screen.queryByText(/Location:/)).not.toBeInTheDocument();
    });
  });

  describe("likes", () => {
    it("shows likes when greater than 0", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(
        screen.getByText(`Likes: ${baseProps.image.likes}`),
      ).toBeInTheDocument();
    });

    it("hides likes when 0", () => {
      render(
        <ImageDetailsDisplay {...baseProps} image={makeImage({ likes: 0 })} />,
      );
      expect(screen.queryByText(/Likes:/)).not.toBeInTheDocument();
    });
  });

  describe("social links", () => {
    it("shows Instagram link when instagram_username is present", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          image={makeImage({
            user: { ...makeImage().user, instagram_username: "testgram" },
          })}
        />,
      );
      expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
        "href",
        "https://www.instagram.com/testgram",
      );
    });

    it("hides Instagram link when instagram_username is absent", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(
        screen.queryByRole("link", { name: "Instagram" }),
      ).not.toBeInTheDocument();
    });

    it("shows Twitter link when twitter_username is present", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          image={makeImage({
            user: { ...makeImage().user, twitter_username: "testtweet" },
          })}
        />,
      );
      expect(screen.getByRole("link", { name: "Twitter" })).toHaveAttribute(
        "href",
        "https://twitter.com/testtweet",
      );
    });

    it("hides Twitter link when twitter_username is absent", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(
        screen.queryByRole("link", { name: "Twitter" }),
      ).not.toBeInTheDocument();
    });

    it("shows Portfolio link when portfolio_url is present", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          image={makeImage({
            user: {
              ...makeImage().user,
              portfolio_url: "https://portfolio.example.com",
            },
          })}
        />,
      );
      expect(screen.getByRole("link", { name: "Portfolio" })).toHaveAttribute(
        "href",
        "https://portfolio.example.com",
      );
    });

    it("hides Portfolio link when portfolio_url is absent", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(
        screen.queryByRole("link", { name: "Portfolio" }),
      ).not.toBeInTheDocument();
    });

    it("always shows the Source link", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
        "href",
        baseProps.image.links.html,
      );
    });
  });

  describe("See More Photos button", () => {
    it("is shown when activeUsername does not match", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          activeMode="photos"
          activeUsername="other-user"
        />,
      );
      expect(
        screen.getByRole("button", { name: /See More Photos by Test User/ }),
      ).toBeInTheDocument();
    });

    it("is hidden when viewing this author's photos", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          activeMode="photos"
          activeUsername="testuser"
        />,
      );
      expect(
        screen.queryByRole("button", { name: /See More Photos/ }),
      ).not.toBeInTheDocument();
    });

    it("calls onAuthorClick with username when clicked", async () => {
      const user = userEvent.setup();
      render(<ImageDetailsDisplay {...baseProps} />);
      await user.click(
        screen.getByRole("button", { name: /See More Photos by Test User/ }),
      );
      expect(onAuthorClick).toHaveBeenCalledWith("testuser");
    });
  });

  describe("Liked Photos button", () => {
    it("is shown when activeUsername does not match", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          activeMode="likes"
          activeUsername="other-user"
        />,
      );
      expect(
        screen.getByRole("button", { name: /Liked Photos by Test User/ }),
      ).toBeInTheDocument();
    });

    it("is hidden when viewing this author's liked photos", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          activeMode="likes"
          activeUsername="testuser"
        />,
      );
      expect(
        screen.queryByRole("button", { name: /Liked Photos/ }),
      ).not.toBeInTheDocument();
    });

    it("calls onLikesClick with username when clicked", async () => {
      const user = userEvent.setup();
      render(<ImageDetailsDisplay {...baseProps} />);
      await user.click(
        screen.getByRole("button", { name: /Liked Photos by Test User/ }),
      );
      expect(onLikesClick).toHaveBeenCalledWith("testuser");
    });
  });

  describe("Collections button", () => {
    const imageWithCollections = makeImage({
      user: { ...makeImage().user, total_collections: 3 },
    });

    it("is shown when author has collections and activeUsername does not match", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          activeMode="collections"
          activeUsername="other-user"
          image={imageWithCollections}
        />,
      );
      expect(
        screen.getByRole("button", { name: /Collections by Test User/ }),
      ).toBeInTheDocument();
    });

    it("is hidden when total_collections is 0", () => {
      render(<ImageDetailsDisplay {...baseProps} />);
      expect(
        screen.queryByRole("button", { name: /Collections/ }),
      ).not.toBeInTheDocument();
    });

    it("is hidden when viewing this author's collections", () => {
      render(
        <ImageDetailsDisplay
          {...baseProps}
          activeMode="collections"
          activeUsername="testuser"
          image={imageWithCollections}
        />,
      );
      expect(
        screen.queryByRole("button", { name: /Collections/ }),
      ).not.toBeInTheDocument();
    });

    it("calls onCollectionsClick with username when clicked", async () => {
      const user = userEvent.setup();
      render(
        <ImageDetailsDisplay {...baseProps} image={imageWithCollections} />,
      );
      await user.click(
        screen.getByRole("button", { name: /Collections by Test User/ }),
      );
      expect(onCollectionsClick).toHaveBeenCalledWith("testuser");
    });
  });
});
