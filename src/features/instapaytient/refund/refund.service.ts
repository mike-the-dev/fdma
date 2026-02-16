import apiClient from "@/utils/apiClient";

import {
  ProcessRefundRequest,
  ProcessRefundResponse,
} from "./refund.schema";

export const processRefund = async (
  payload: ProcessRefundRequest
): Promise<ProcessRefundResponse> => {
  const res = await apiClient.post<ProcessRefundResponse>(
    "/api/user/refunds",
    payload
  );

  return res.data;
};
