/**
 * Handles the API request for searching images.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the request is handled.
 */
export default async function handler(req, res) {
  const { query, page } = req.query;

  const IMAGES_PER_PAGE = 12;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.UNSPLASH_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching images from Unsplash' });
  }
}
