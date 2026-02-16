import axios from "axios";

export type RefundErrorCode =
  | "TOKEN_EXPIRED"
  | "INSUFFICIENT_FUNDS"
  | "INVALID"
  | "NETWORK"
  | "UNKNOWN";

export type RefundError = {
  code: RefundErrorCode;
  message: string;
};

export const toRefundError = (err: unknown): RefundError => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const dataMessage = err.response?.data?.message || err.message;

    if (status === 401)
      return {
        code: "TOKEN_EXPIRED",
        message: "Session expired. Please sign in again.",
      };

    if (
      status === 400 &&
      typeof dataMessage === "string" &&
      dataMessage.includes("insufficient funds")
    ) {
      return {
        code: "INSUFFICIENT_FUNDS",
        message: dataMessage,
      };
    }

    if (status === 400)
      return {
        code: "INVALID",
        message: dataMessage || "Invalid refund request.",
      };

    return {
      code: "NETWORK",
      message: dataMessage || "Network error. Please try again.",
    };
  }

  if (err instanceof Error) return { code: "UNKNOWN", message: err.message };

  return { code: "UNKNOWN", message: "Unexpected error occurred." };
};
