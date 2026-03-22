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

  it("switches to user likes mode when 'Liked Photos' is clicked", async () => {
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
      screen.getByRole("button", { name: "Liked Photos by John Doe" }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("/api/users/johndoe/likes"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("switches to user collections mode when 'Collections' is clicked", async () => {
    const image = makeImage({
      id: "1",
      user: {
        ...makeImage().user,
        username: "johndoe",
        name: "John Doe",
        total_collections: 3,
      },
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
      screen.getByRole("button", { name: "Collections by John Doe" }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("/api/users/johndoe/collections"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("disables the search input and button while a fetch is in-flight", async () => {
    let resolveFetch!: (value: Response) => void;

    global.fetch = jest.fn().mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }),
    );

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
    expect(screen.getByRole("searchbox")).toBeDisabled();

    resolveFetch({
      ok: true,
      json: () => Promise.resolve({ results: [], total_pages: 0 }),
    } as unknown as Response);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Search" })).not.toBeDisabled();
    });

    expect(screen.getByRole("searchbox")).not.toBeDisabled();
  });

  it("does not fetch when the search form is submitted with an empty query", async () => {
    mockFetch();

    const user = userEvent.setup();

    render(<Home />);

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fetches random photos when random mode is on and a filter is clicked", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 0);

    const user = userEvent.setup();

    render(<Home />);

    await user.click(screen.getByRole("button", { name: /random/i }));

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`^${imageButtons[0]}$`, "i"),
      }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api/photos/random?count=12&query=${imageButtons[0]}`,
        ),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("includes order_by=latest in the URL after toggling sort order", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 1);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("a test image")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Relevance" }));
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("order_by=latest"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("re-fetches with updated per_page when the per-page selector changes", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 1);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("a test image")).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Results per page" }),
      "18 results",
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("per_page=18"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("includes color in the URL after selecting a color filter and searching", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 1);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("a test image")).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Color filter" }),
      "Blue",
    );

    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("color=blue"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("re-fetches with updated lang when the language selector changes", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 1);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("a test image")).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Language" }),
      "French",
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("lang=fr"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("navigates to a specific page using the Go button", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 5);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByAltText("a test image")).toBeInTheDocument();
    });

    const pageInput = screen.getByRole("spinbutton", {
      name: "Page Number Input",
    });

    await user.clear(pageInput);
    await user.type(pageInput, "3");
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("&page=3&"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("resets to page 1 and fetches when a filter button is clicked from page 2", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 3);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`^${imageButtons[0]}$`, "i"),
      }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining(`query=${imageButtons[0]}`),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining("page=1"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("resets to page 1 when per-page is changed while on page 2", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 3);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Results per page" }),
      "18 results",
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("per_page=18"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining("page=1"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("resets to page 1 and fetches when a new search is submitted from page 2", async () => {
    const image = makeImage({ id: "1" });

    mockFetch([image], 3);

    const user = userEvent.setup();

    render(<Home />);

    await user.type(screen.getByRole("searchbox"), "nature");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "mountains");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("query=mountains"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining("page=1"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("shows 'Relevance' label after toggling sort order twice", async () => {
    mockFetch();

    const user = userEvent.setup();

    render(<Home />);

    await user.click(screen.getByRole("button", { name: "Relevance" }));

    expect(
      screen.getByRole("button", { name: "Latest" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Latest" }));

    expect(
      screen.getByRole("button", { name: "Relevance" }),
    ).toBeInTheDocument();
  });

  it("shows 'Light Mode' label after clicking the dark mode toggle", async () => {
    mockFetch();

    const user = userEvent.setup();

    render(<Home />);

    expect(
      screen.getByRole("button", { name: "Dark Mode" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dark Mode" }));

    expect(
      screen.getByRole("button", { name: "Light Mode" }),
    ).toBeInTheDocument();
  });

  it("fetches the previous page when the Previous button is clicked", async () => {
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
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Previous" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        expect.stringContaining("&page=1&"),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });
});
