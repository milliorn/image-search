import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles the API request for searching images.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the request is handled.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { query, page } = req.query;

  const IMAGES_PER_PAGE: number = 12;

  if (!query || Array.isArray(query)) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  const pageNum = Array.isArray(page) ? NaN : parseInt(String(page ?? "1"), 10);
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ message: "Invalid page parameter" });
  }

  const unsplashKey = process.env["UNSPLASH_KEY"];

  if (!unsplashKey) {
    console.error("Unsplash API key (UNSPLASH_KEY) is not configured.");
    return res
      .status(500)
      .json({ message: "Unsplash API key is not configured on the server" });
  }

  const params = new URLSearchParams({
    query,
    page: String(pageNum),
    per_page: String(IMAGES_PER_PAGE),
    client_id: unsplashKey,
  });

  const apiUrl = `https://api.unsplash.com/search/photos?${params.toString()}`;
  
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: `Unsplash API error: ${response.statusText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching images from Unsplash" });
  }
}
