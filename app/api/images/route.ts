/**
 * GET /api/images
 *
 * Proxies search requests to the Unsplash API and returns paginated photo results.
 * Keeping the Unsplash client ID server-side prevents it from being exposed to the browser.
 *
 * Query params:
 *   query — search term (required)
 *   page  — page number, defaults to 1
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IMAGES_PER_PAGE } from "@/app/utils/constants";

async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query");
  const pageParam = searchParams.get("page") ?? "1";
  const perPageParam = searchParams.get("per_page") ?? String(IMAGES_PER_PAGE);

  if (!query) {
    return NextResponse.json(
      { message: "Query parameter is required" },
      { status: 400 },
    );
  }

  const pageNum = parseInt(pageParam, 10);
  if (isNaN(pageNum) || pageNum < 1) {
    return NextResponse.json(
      { message: "Invalid page parameter" },
      { status: 400 },
    );
  }

  const perPageNum = parseInt(perPageParam, 10);
  if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 30) {
    return NextResponse.json(
      { message: "Invalid per_page parameter" },
      { status: 400 },
    );
  }

  const unsplashKey = process.env["UNSPLASH_KEY"];

  if (!unsplashKey) {
    console.error("Unsplash API key (UNSPLASH_KEY) is not configured.");
    return NextResponse.json(
      { message: "Unsplash API key is not configured on the server" },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    query,
    page: String(pageNum),
    per_page: String(perPageNum),
    client_id: unsplashKey,
  });

  const apiUrl = `https://api.unsplash.com/search/photos?${params.toString()}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 86400 } });

    if (!response.ok) {
      const messages: Record<number, string> = {
        400: "The search request was invalid. Please try a different query.",
        401: "Unsplash API key is invalid or revoked. Check server configuration.",
        403: "Unsplash API key is invalid or revoked. Check server configuration.",
        404: "The requested resource was not found on Unsplash.",
        500: "Unsplash is experiencing issues. Please try again later.",
        503: "Unsplash is temporarily unavailable. Please try again later.",
      };

      const message = messages[response.status] ?? `Unsplash API error (${response.status}).`;

      if (response.status === 401 || response.status === 403) {
        console.error(`Unsplash API key is invalid or revoked (${response.status}).`);
      }

      return NextResponse.json({ message }, { status: response.status });
    }

    const data: unknown = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching images from Unsplash" },
      { status: 500 },
    );
  }
}

export { GET };
