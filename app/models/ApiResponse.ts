import type { ImageDetails } from "./ImageDetails";

/** Returned by any proxy route when the Unsplash API responds with an error or validation fails. */
type ApiErrorResponse = { message: string };

/** Returned by all proxy routes on success. total_pages is 0 for random results, which hides pagination. */
type ApiSuccessResponse = { results: ImageDetails[]; total_pages: number };

/** Union of all possible shapes returned by the Unsplash proxy routes. Narrow with `"results" in data`. */
type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

export type { ApiResponse };
