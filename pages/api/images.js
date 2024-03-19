export default async function handler(req, res) {
  const { query, page } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=10&client_id=${process.env.UNSPLASH_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching images from Unsplash' });
  }
}
