import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { makeImage } from "../fixtures/makeImage";
import { imageButtons } from "@/app/utils/constants";
import type { ImageDetails } from "@/app/models/ImageDetails";

// matchMedia is not implemented in jsdom.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

function mockFetch(results: ImageDetails[] = [], totalPages = 0) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ results, total_pages: totalPages }),
  } as unknown as Response);
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("Home page integration", () => {
  it("renders initial state without calling fetch", () => {
    mockFetch();

    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Image Search" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("searchbox")).toBeInTheDocument();

    expect(
      screen.getByText("Search for images above to get started."),
    ).toBeInTheDocument();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows images and pagination after a successful search", async () => {
    const image = makeImage({ id: "1", alt_description: "mountain lake" });
    
    mockFetch([image], 3);
    
    const user = userEvent.setup();
    
    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("mountain lake")).toBeInTheDocument();
    });

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/images?query=nature"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("shows an error message when the API returns an error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: "Internal Server Error",
      json: () => Promise.resolve({ message: "Something went wrong" }),
    } as unknown as Response);
    
    const user = userEvent.setup();
    
    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("shows 'No results found.' when the API returns an empty array", async () => {
    mockFetch([], 0);
    
    const user = userEvent.setup();
    
    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "xkcdzzz");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });
  });

  it("fetches with filter query when a category button is clicked", async () => {
    const image = makeImage({ id: "1" });
    
    mockFetch([image], 1);
    
    const user = userEvent.setup();
    
    render(<Home />);

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`^${imageButtons[0]}$`, "i"),
      }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/images?query=${imageButtons[0]}`),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("fetches page 2 when the Next button is clicked", async () => {
    const image = makeImage({ id: "1" });
    
    mockFetch([image], 3);
    
    const user = userEvent.setup();
    
    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("a test image")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("page=2"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("resets to initial state when the title is clicked", async () => {
    const image = makeImage({ id: "1" });
    
    mockFetch([image], 1);
    
    const user = userEvent.setup();
    
    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("a test image")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Image Search" }));

    expect(
      screen.getByText("Search for images above to get started."),
    ).toBeInTheDocument();
    
    expect(screen.queryByAltText("a test image")).not.toBeInTheDocument();
  });

  it("switches to user photos mode when 'See More Photos' is clicked", async () => {
    const image = makeImage({
      id: "1",
      user: { ...makeImage().user, username: "johndoe", name: "John Doe" },
    });
    
    mockFetch([image], 1);
    
    const user = userEvent.setup();
    
    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    mockFetch([image], 2);
    
    await user.click(
      screen.getByRole("button", { name: "See More Photos by John Doe" }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("/api/users/johndoe/photos"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });
});
