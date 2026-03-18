/**
 * GET /api/photos/random
 *
 * Proxies requests to the Unsplash random photos endpoint.
 * Returns results in the same { results, total_pages } shape as /api/images
 * so the existing hook can consume it without modification.
 * total_pages is 0 so pagination controls are hidden for random results.
 *
 * Query params:
 *   count — number of photos to return, defaults to IMAGES_PER_PAGE, max 30
 *   query — optional search term to filter random results
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IMAGES_PER_PAGE } from "@/app/utils/constants";

async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const countParam = searchParams.get("count") ?? String(IMAGES_PER_PAGE);
  const query = searchParams.get("query") ?? "";
  const count = parseInt(countParam, 10);

  if (isNaN(count) || count < 1 || count > 30) {
    return NextResponse.json(
      { message: "Invalid count parameter" },
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
    count: String(count),
    client_id: unsplashKey,
  });

  if (query) {
    apiParams.set("query", query);
  }

  const apiUrl = `https://api.unsplash.com/photos/random?${apiParams.toString()}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const messages: Record<number, string> = {
        401: "Unsplash API key is invalid or revoked. Check server configuration.",
        403: "Unsplash API key is invalid or revoked. Check server configuration.",
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

    const photos: unknown = await response.json();

    return NextResponse.json({ results: photos, total_pages: 0 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetching random photos from Unsplash" },
      { status: 500 },
    );
  }
}

export { GET };
