import { renderHook, act } from "@testing-library/react";
import type { RefObject } from "react";
import useFetchImages from "@/app/hooks/fetchImages";
import type { ImageDetails } from "@/app/models/ImageDetails";

const makePhoto = (id: string) => ({ id }) as unknown as ImageDetails;

const makeSearchInput = (value: string): RefObject<HTMLInputElement | null> =>
  ({
    current: { value } as HTMLInputElement,
  }) as RefObject<HTMLInputElement | null>;

type RenderOptions = {
  searchInput?: RefObject<HTMLInputElement | null>;
  setLoading?: jest.Mock;
  setError?: jest.Mock;
  setImages?: jest.Mock;
  setTotalPages?: jest.Mock;
  page?: number;
  perPage?: number;
  lang?: string;
  orderBy?: "relevance" | "latest";
  color?: string;
  username?: string;
  userFetchMode?: "photos" | "likes" | "collections";
  isRandom?: boolean;
};

function renderFetchImages(options: RenderOptions = {}) {
  const searchInput = options.searchInput ?? makeSearchInput("cats");
  const setLoading = options.setLoading ?? jest.fn();
  const setError = options.setError ?? jest.fn();
  const setImages = options.setImages ?? jest.fn();
  const setTotalPages = options.setTotalPages ?? jest.fn();

  const { result } = renderHook(() =>
    useFetchImages(
      searchInput,
      setLoading,
      setError,
      options.page ?? 1,
      options.perPage ?? 12,
      options.lang ?? "en",
      options.orderBy ?? "relevance",
      options.color ?? "",
      options.username ?? "",
      options.userFetchMode ?? "photos",
      setImages,
      setTotalPages,
      options.isRandom ?? false,
    ),
  );

  return { result, setLoading, setError, setImages, setTotalPages };
}

beforeEach(() => {
  // jsdom doesn't provide fetch; seed it so jest.spyOn can attach a spy
  global.fetch = jest.fn() as unknown as typeof global.fetch;
});

function mockSuccessFetch(data: unknown = { results: [], total_pages: 1 }) {
  return jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValue(data),
  } as unknown as Response);
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useFetchImages — search mode", () => {
  it("calls /api/images with the correct params", async () => {
    const fetchSpy = mockSuccessFetch();
    const { result } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    const url = fetchSpy.mock.calls[0]?.[0] as string;

    expect(url).toContain("/api/images");
    expect(url).toContain("query=cats");
    expect(url).toContain("page=1");
    expect(url).toContain("per_page=12");
    expect(url).toContain("lang=en");
    expect(url).toContain("order_by=relevance");
  });

  it("includes color param when color is set", async () => {
    const fetchSpy = mockSuccessFetch();
    const { result } = renderFetchImages({ color: "blue" });

    await act(async () => {
      await result.current("cats");
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).toContain("color=blue");
  });

  it("returns early without calling fetch when query is empty", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { result } = renderFetchImages({ searchInput: makeSearchInput("") });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns early without calling fetch when searchInput.current is null", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");

    const { result } = renderFetchImages({
      searchInput: { current: null } as RefObject<HTMLInputElement | null>,
    });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("calls setLoading(true) then setLoading(false) on success", async () => {
    mockSuccessFetch();

    const setLoading = jest.fn();
    const { result } = renderFetchImages({ setLoading });

    await act(async () => {
      await result.current("cats");
    });

    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it("calls setImages and setTotalPages on success", async () => {
    const photos = [makePhoto("1"), makePhoto("2")];

    mockSuccessFetch({ results: photos, total_pages: 5 });

    const setImages = jest.fn();
    const setTotalPages = jest.fn();
    const { result } = renderFetchImages({ setImages, setTotalPages });

    await act(async () => {
      await result.current("cats");
    });

    expect(setImages).toHaveBeenCalledWith(photos);
    expect(setTotalPages).toHaveBeenCalledWith(5);
  });

  it("deduplicates results by id", async () => {
    const photo = makePhoto("dup");

    mockSuccessFetch({ results: [photo, photo], total_pages: 1 });

    const setImages = jest.fn();
    const { result } = renderFetchImages({ setImages });

    await act(async () => {
      await result.current("cats");
    });

    expect(setImages).toHaveBeenCalledWith([photo]);
  });
});

describe("useFetchImages — random mode", () => {
  it("calls /api/photos/random with count param", async () => {
    const fetchSpy = mockSuccessFetch({ results: [], total_pages: 0 });
    const { result } = renderFetchImages({ isRandom: true });

    await act(async () => {
      await result.current();
    });

    const url = fetchSpy.mock.calls[0]?.[0] as string;

    expect(url).toContain("/api/photos/random");
    expect(url).toContain("count=12");
  });

  it("includes query in random URL when searchInput has a value", async () => {
    const fetchSpy = mockSuccessFetch({ results: [], total_pages: 0 });
    const { result } = renderFetchImages({
      isRandom: true,
      searchInput: makeSearchInput("mountains"),
    });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).toContain("query=mountains");
  });

  it("omits query from random URL when searchInput is empty", async () => {
    const fetchSpy = mockSuccessFetch({ results: [], total_pages: 0 });
    const { result } = renderFetchImages({
      isRandom: true,
      searchInput: makeSearchInput(""),
    });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).not.toContain("query=");
  });

  it("omits query from random URL when searchInput.current is null", async () => {
    const fetchSpy = mockSuccessFetch({ results: [], total_pages: 0 });
    const { result } = renderFetchImages({
      isRandom: true,
      searchInput: { current: null } as RefObject<HTMLInputElement | null>,
    });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).not.toContain("query=");
  });
});

describe("useFetchImages — user mode", () => {
  it("calls /api/users/:username/photos", async () => {
    const fetchSpy = mockSuccessFetch();
    const { result } = renderFetchImages({
      username: "johndoe",
      userFetchMode: "photos",
    });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).toContain(
      "/api/users/johndoe/photos",
    );
  });

  it("calls /api/users/:username/likes", async () => {
    const fetchSpy = mockSuccessFetch();
    const { result } = renderFetchImages({
      username: "johndoe",
      userFetchMode: "likes",
    });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).toContain(
      "/api/users/johndoe/likes",
    );
  });

  it("calls /api/users/:username/collections", async () => {
    const fetchSpy = mockSuccessFetch();
    const { result } = renderFetchImages({
      username: "johndoe",
      userFetchMode: "collections",
    });

    await act(async () => {
      await result.current();
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).toContain(
      "/api/users/johndoe/collections",
    );
  });
});

describe("useFetchImages — error handling", () => {
  it("calls setError with the message from the error response body", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
      json: jest.fn().mockResolvedValue({ message: "Resource not found" }),
    } as unknown as Response);

    const { result, setError } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    expect(setError).toHaveBeenCalledWith("Resource not found");
  });

  it("falls back to statusText when error response body has no message", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      statusText: "Service Unavailable",
      json: jest.fn().mockRejectedValue(new Error("not JSON")),
    } as unknown as Response);

    const { result, setError } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    expect(setError).toHaveBeenCalledWith(
      "Failed to fetch images: Service Unavailable",
    );
  });

  it("calls setError when response body has no results key", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: "Unexpected error" }),
    } as unknown as Response);

    const { result, setError } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    expect(setError).toHaveBeenCalledWith("Unexpected error");
  });

  it("falls back to generic message when data has no results and no message", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    } as unknown as Response);

    const { result, setError } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    expect(setError).toHaveBeenCalledWith(
      "Unexpected response from the server.",
    );
  });

  it("calls setError when the success response body cannot be parsed as JSON", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    } as unknown as Response);

    const { result, setError } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    expect(setError).toHaveBeenCalledWith(
      "Received an unexpected response from the server.",
    );
  });

  it("swallows AbortError without calling setError or setLoading(false)", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));

    const { result, setError, setLoading } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).not.toHaveBeenCalledWith(false);
    expect(setError).not.toHaveBeenCalledWith(expect.any(String));
  });

  it("calls setError on a non-abort network error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Network failure"));

    const { result, setError } = renderFetchImages();

    await act(async () => {
      await result.current("cats");
    });

    expect(setError).toHaveBeenCalledWith(
      "Something went wrong. Please try again.",
    );
  });
});

describe("useFetchImages — ref sync", () => {
  it("uses the updated orderBy value after rerender", async () => {
    const setLoading = jest.fn();
    const setError = jest.fn();
    const setImages = jest.fn();
    const setTotalPages = jest.fn();
    const searchInput = makeSearchInput("cats");

    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ results: [], total_pages: 1 }),
    } as unknown as Response);

    const { result, rerender } = renderHook(
      ({ orderBy }: { orderBy: "relevance" | "latest" }) =>
        useFetchImages(
          searchInput,
          setLoading,
          setError,
          1,
          12,
          "en",
          orderBy,
          "",
          "",
          "photos",
          setImages,
          setTotalPages,
          false,
        ),
      { initialProps: { orderBy: "relevance" as "relevance" | "latest" } },
    );

    await act(async () => {
      await result.current("cats");
    });

    expect(fetchSpy.mock.calls[0]?.[0] as string).toContain(
      "order_by=relevance",
    );

    rerender({ orderBy: "latest" });

    await act(async () => {
      await result.current("cats");
    });

    expect(fetchSpy.mock.calls[1]?.[0] as string).toContain("order_by=latest");
  });
});
