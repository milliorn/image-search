/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/images/route";

function makeRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/images");

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );
  return new NextRequest(url.toString());
}

beforeEach(() => {
  process.env["UNSPLASH_KEY"] = "test-key";
});

afterEach(() => {
  delete process.env["UNSPLASH_KEY"];
  jest.restoreAllMocks();
});

describe("GET /api/images — input validation", () => {
  it("returns 400 when query is missing", async () => {
    const res = await GET(makeRequest());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Query parameter is required",
    });
  });

  it("returns 400 when order_by is invalid", async () => {
    const res = await GET(makeRequest({ query: "cats", order_by: "popular" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Invalid order_by parameter",
    });
  });

  it("returns 400 when page is 0", async () => {
    const res = await GET(makeRequest({ query: "cats", page: "0" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid page parameter" });
  });

  it("returns 400 when page is not a number", async () => {
    const res = await GET(makeRequest({ query: "cats", page: "abc" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid page parameter" });
  });

  it("returns 400 when per_page is 0", async () => {
    const res = await GET(makeRequest({ query: "cats", per_page: "0" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid per_page parameter" });
  });

  it("returns 400 when per_page exceeds 30", async () => {
    const res = await GET(makeRequest({ query: "cats", per_page: "31" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid per_page parameter" });
  });
});

describe("GET /api/images — missing API key", () => {
  it("returns 500 when UNSPLASH_KEY is not set", async () => {
    delete process.env["UNSPLASH_KEY"];
    
    const res = await GET(makeRequest({ query: "cats" }));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      message: "Unsplash API key is not configured on the server",
    });
  });
});

describe("GET /api/images — upstream responses", () => {
  it("returns 200 with the upstream body on success", async () => {
    const mockData = { results: [{ id: "1" }], total_pages: 5 };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    const res = await GET(makeRequest({ query: "cats" }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockData);
  });

  it("returns 401 with key-revoked message when upstream returns 401", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as unknown as Response);

    const res = await GET(makeRequest({ query: "cats" }));
    expect(res.status).toBe(401);

    const body = (await res.json()) as { message: string };
    expect(body.message).toContain("invalid or revoked");
  });

  it("returns 429 with rate-limit message when upstream returns 429", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 429,
    } as unknown as Response);

    const res = await GET(makeRequest({ query: "cats" }));
    expect(res.status).toBe(429);

    const body = (await res.json()) as { message: string };
    expect(body.message).toContain("Rate limit");
  });

  it("returns 500 when fetch throws a network error", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Network failure"));

    const res = await GET(makeRequest({ query: "cats" }));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      message: "Error fetching images from Unsplash",
    });
  });
});

describe("GET /api/images — upstream URL construction", () => {
  it("includes color in the upstream URL when color is provided", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ results: [], total_pages: 1 }),
    } as unknown as Response);

    await GET(makeRequest({ query: "cats", color: "blue" }));

    const calledUrl = fetchSpy.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("color=blue");
  });

  it("omits color from the upstream URL when color is empty", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ results: [], total_pages: 1 }),
    } as unknown as Response);

    await GET(makeRequest({ query: "cats" }));

    const calledUrl = fetchSpy.mock.calls[0]?.[0] as string;
    expect(calledUrl).not.toContain("color=");
  });
});
