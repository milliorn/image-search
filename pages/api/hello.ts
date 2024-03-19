import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Represents the response data returned by the API.
 */
type ResponseData = {
  message: string
}

/**
 * Handles the API request and sends a JSON response.
 *
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): void {
  res.status(200).json({ message: 'Hello from Next.js!' })
}