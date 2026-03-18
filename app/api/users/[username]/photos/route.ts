/**
 * GET /api/users/:username/photos
 *
 * Proxies requests to the Unsplash user photos endpoint.
 * Returns results in the same { results, total_pages } shape as /api/images
 * so the existing hook can consume both without changes to the response handling.
 *
 * Query params:
 *   page     — page number, defaults to 1
 *   per_page — results per page, defaults to IMAGES_PER_PAGE
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IMAGES_PER_PAGE } from "@/app/utils/constants";

async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
): Promise<NextResponse> {
  const { username } = await params;
  const { searchParams } = req.nextUrl;
  const pageParam = searchParams.get("page") ?? "1";
  const perPageParam = searchParams.get("per_page") ?? String(IMAGES_PER_PAGE);

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

  const apiParams = new URLSearchParams({
    page: String(pageNum),
    per_page: String(perPageNum),
    client_id: unsplashKey,
  });

  const apiUrl = `https://api.unsplash.com/users/${username}/photos?${apiParams.toString()}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

    if (!response.ok) {
      const messages: Record<number, string> = {
        401: "Unsplash API key is invalid or revoked. Check server configuration.",
        403: "Unsplash API key is invalid or revoked. Check server configuration.",
        404: `User "${username}" was not found on Unsplash.`,
        429: "Rate limit reached. Please wait a moment before searching again.",
        500: "Unsplash is experiencing issues. Please try again later.",
        503: "Unsplash is temporarily unavailable. Please try again later.",
      };

      const message =
        messages[response.status] ?? `Unsplash API error (${response.status}).`;

      if (response.status === 401 || response.status === 403) {
        console.error(
          `Unsplash API key is invalid or revoked (${response.status}).`,
        );
      }

      return NextResponse.json({ message }, { status: response.status });
    }

    const total = parseInt(response.headers.get("X-Total") ?? "0", 10);
    const photos: unknown = await response.json();
    const total_pages = Math.ceil(total / perPageNum);

    return NextResponse.json({ results: photos, total_pages });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching user photos from Unsplash" },
      { status: 500 },
    );
  }
}

export { GET };
