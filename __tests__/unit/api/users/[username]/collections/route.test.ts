/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/users/[username]/collections/route";

function makeRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/users/testuser/collections");

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );

  return new NextRequest(url.toString());
}

function makeParams(username = "testuser"): {
  params: Promise<{ username: string }>;
} {
  return { params: Promise.resolve({ username }) };
}

beforeEach(() => {
  process.env["UNSPLASH_KEY"] = "test-key";
});

afterEach(() => {
  delete process.env["UNSPLASH_KEY"];
  jest.restoreAllMocks();
});

describe("GET /api/users/:username/collections — input validation", () => {
  it("returns 400 when page is 0", async () => {
    const res = await GET(makeRequest({ page: "0" }), makeParams());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid page parameter" });
  });

  it("returns 400 when page is not a number", async () => {
    const res = await GET(makeRequest({ page: "abc" }), makeParams());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid page parameter" });
  });

  it("returns 400 when per_page is 0", async () => {
    const res = await GET(makeRequest({ per_page: "0" }), makeParams());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid per_page parameter" });
  });

  it("returns 400 when per_page exceeds 30", async () => {
    const res = await GET(makeRequest({ per_page: "31" }), makeParams());

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Invalid per_page parameter" });
  });
});

describe("GET /api/users/:username/collections — missing API key", () => {
  it("returns 500 when UNSPLASH_KEY is not set", async () => {
    delete process.env["UNSPLASH_KEY"];

    const res = await GET(makeRequest(), makeParams());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      message: "Unsplash API key is not configured on the server",
    });
  });
});

describe("GET /api/users/:username/collections — cover_photo extraction", () => {
  it("returns cover_photo from each collection as results", async () => {
    const photo1 = { id: "p1" };
    const photo2 = { id: "p2" };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: jest
        .fn()
        .mockResolvedValue([{ cover_photo: photo1 }, { cover_photo: photo2 }]),
    } as unknown as Response);

    const res = await GET(makeRequest(), makeParams());
    const body = (await res.json()) as { results: unknown[] };

    expect(body.results).toEqual([photo1, photo2]);
  });

  it("filters out collections where cover_photo is null", async () => {
    const photo = { id: "p1" };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: jest
        .fn()
        .mockResolvedValue([
          { cover_photo: photo },
          { cover_photo: null },
          { cover_photo: null },
        ]),
    } as unknown as Response);

    const res = await GET(makeRequest(), makeParams());
    const body = (await res.json()) as { results: unknown[] };

    expect(body.results).toEqual([photo]);
  });

  it("returns empty results when all collections have null cover_photo", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: jest
        .fn()
        .mockResolvedValue([{ cover_photo: null }, { cover_photo: null }]),
    } as unknown as Response);

    const res = await GET(makeRequest(), makeParams());
    const body = (await res.json()) as { results: unknown[] };

    expect(body.results).toEqual([]);
  });

  it("returns total_pages derived from X-Total header", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => (name === "X-Total" ? "30" : null) },
      json: jest.fn().mockResolvedValue([{ cover_photo: { id: "p1" } }]),
    } as unknown as Response);

    const res = await GET(makeRequest({ per_page: "10" }), makeParams());
    const body = (await res.json()) as { total_pages: number };

    expect(body.total_pages).toBe(3);
  });
});

describe("GET /api/users/:username/collections — upstream responses", () => {
  it("returns 404 with a user-not-found message containing the username", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as unknown as Response);

    const res = await GET(makeRequest(), makeParams("janedoe"));
    expect(res.status).toBe(404);

    const body = (await res.json()) as { message: string };
    expect(body.message).toContain("janedoe");
  });

  it("returns 401 with key-revoked message and logs an error when upstream returns 401", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as unknown as Response);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await GET(makeRequest(), makeParams());

    expect(res.status).toBe(401);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("401"));
  });

  it("returns the status code with a generic message when upstream returns an unknown error", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 418,
    } as unknown as Response);

    const res = await GET(makeRequest(), makeParams());

    expect(res.status).toBe(418);
    expect(await res.json()).toEqual({
      message: "Unsplash API error (418).",
    });
  });

  it("returns 429 with rate-limit message when upstream returns 429", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 429,
    } as unknown as Response);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(429);

    const body = (await res.json()) as { message: string };
    expect(body.message).toContain("Rate limit");
  });

  it("returns 500 when fetch throws a network error", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Network failure"));

    const res = await GET(makeRequest(), makeParams());

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      message: "Error fetching collections from Unsplash",
    });
  });
});

describe("GET /api/users/:username/collections — upstream URL construction", () => {
  it("interpolates the username into the upstream URL", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    await GET(makeRequest(), makeParams("johndoe"));

    const calledUrl = fetchSpy.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("/users/johndoe/collections");
  });

  it("passes revalidate: 3600 to fetch", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    await GET(makeRequest(), makeParams());

    const calledInit = fetchSpy.mock.calls[0]?.[1] as {
      next: { revalidate: number };
    };
    expect(calledInit.next.revalidate).toBe(3600);
  });
});
