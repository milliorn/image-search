import type { ImageDetails } from "./ImageDetails";

type ApiErrorResponse = { message: string };
type ApiSuccessResponse = { results: ImageDetails[]; total_pages: number };

/** Union type for the /api/images route: success returns results and total_pages; error returns a message string. */
type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

export type { ApiResponse };
