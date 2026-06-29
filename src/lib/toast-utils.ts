import type { ToastType } from "@/components/ui/toast";
import { ApiError } from "@/lib/api-client";

// Maps Spring's errorCode + HTTP status to a user-friendly toast payload

const ERROR_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: "Invalid email or password.",
  AUTH_TOKEN_INVALID_OR_EXPIRED: "Your session has expired. Please sign in again.",
  AUTH_ACCOUNT_NOT_ACTIVE: "Your account is pending approval or has been rejected.",
  UNAUTHORIZED_ACTION: "You don't have permission to perform this action.",
  RESOURCE_NOT_FOUND: "The requested resource was not found.",
  DUPLICATE_RESOURCE: "This record already exists (duplicate email, ID, or code).",
  INVALID_STATE: "This action isn't allowed in the current state.",
  VALIDATION_FAILED: "Please check your inputs — some fields are invalid.",
  DATA_INTEGRITY_VIOLATION: "A data conflict occurred. Please try again.",
  INTERNAL_ERROR: "Something went wrong on the server. Please try again later.",
};

export interface ToastPayload {
  type: ToastType;
  title: string;
  message?: string;
}

export function toastFromApiError(err: ApiError): ToastPayload {
  const known = ERROR_MESSAGES[err.errorCode];

  // 401 / session expired → error variant
  if (err.status === 401 || err.status === 403) {
    return {
      type: "error",
      title: "Access Denied",
      message: known ?? err.message,
    };
  }

  // 5xx → exception variant (progress bar)
  if (err.status >= 500) {
    return {
      type: "exception",
      title: "Server Error",
      message: known ?? err.message,
    };
  }

  // 4xx validation / conflict → error variant
  return {
    type: "error",
    title: "Request Failed",
    message: known ?? err.message,
  };
}

export function toastFromActionError(errorMessage: string): ToastPayload {
  return { type: "error", title: "Error", message: errorMessage };
}

export function toastSuccess(message: string): ToastPayload {
  return { type: "success", title: "Success", message };
}

/**
 * Given an ActionState returned from a Server Action, call the
 * appropriate toast. Returns true if it was an error.
 *
 * Usage in a Client Component:
 *   useEffect(() => {
 *     if (state !== initialState) handleActionState(state, addToast);
 *   }, [state]);
 */
export function handleActionState(
  state: { error: string | null },
  addToast: (t: Omit<{ id: string } & ToastPayload, "id">) => void,
  successMessage = "Done!"
): boolean {
  if (state.error) {
    addToast(toastFromActionError(state.error));
    return true;
  }
  addToast(toastSuccess(successMessage));
  return false;
}
