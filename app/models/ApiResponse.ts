import type { ImageDetails } from "./ImageDetails";

type ApiErrorResponse = { message: string };
type ApiSuccessResponse = { results: ImageDetails[]; total_pages: number };
type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

export type { ApiResponse };
