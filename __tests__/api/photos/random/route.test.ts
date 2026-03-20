/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/photos/random/route";

function makeRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/photos/random");
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

describe("GET /api/photos/random — input validation", () => {
  it("returns 400 when count is 0", async () => {
    const res = await GET(makeRequest({ count: "0" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid count parameter" });
  });

  it("returns 400 when count exceeds 30", async () => {
    const res = await GET(makeRequest({ count: "31" }));
    
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid count parameter" });
  });

  it("returns 400 when count is not a number", async () => {
    const res = await GET(makeRequest({ count: "abc" }));
    
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid count parameter" });
  });
});

describe("GET /api/photos/random — missing API key", () => {
  it("returns 500 when UNSPLASH_KEY is not set", async () => {
    delete process.env["UNSPLASH_KEY"];
    
    const res = await GET(makeRequest());
    
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      message: "Unsplash API key is not configured on the server",
    });
  });
});

describe("GET /api/photos/random — upstream responses", () => {
  it("returns 200 with results wrapped in total_pages: 0", async () => {
    const mockPhotos = [{ id: "1" }, { id: "2" }];
    
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockPhotos),
    } as unknown as Response);

    const res = await GET(makeRequest());
    
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ results: mockPhotos, total_pages: 0 });
  });

  it("always returns total_pages: 0 regardless of result count", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue([{ id: "1" }]),
    } as unknown as Response);

    const res = await GET(makeRequest({ count: "1" }));
    const body = (await res.json()) as { total_pages: number };
    
    expect(body.total_pages).toBe(0);
  });

  it("returns 429 with rate-limit message when upstream returns 429", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 429,
    } as unknown as Response);

    const res = await GET(makeRequest());
    expect(res.status).toBe(429);
    
    const body = (await res.json()) as { message: string };
    expect(body.message).toContain("Rate limit");
  });

  it("returns 500 when fetch throws a network error", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Network failure"));

    const res = await GET(makeRequest());
    
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      message: "Error fetching random photos from Unsplash",
    });
  });
});

describe("GET /api/photos/random — upstream URL construction", () => {
  it("includes query in the upstream URL when query is provided", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    await GET(makeRequest({ query: "mountains" }));

    const calledUrl = fetchSpy.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("query=mountains");
  });

  it("omits query from the upstream URL when query is not provided", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    await GET(makeRequest());

    const calledUrl = fetchSpy.mock.calls[0]?.[0] as string;
    expect(calledUrl).not.toContain("query=");
  });
});
