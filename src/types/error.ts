// ============================================================
// Mirrors com.unimate.dto.ErrorResponse — every error response
// from GlobalExceptionHandler arrives in exactly this shape,
// regardless of which exception type triggered it.
// ============================================================

export interface ErrorResponse {
  message: string;
  errorCode: string;
}