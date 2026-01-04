import type {
  SchedulerTimeUpdateInput,
  SchedulerTimeUpdateResponse,
} from "./_shared/scheduler.schema";

import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-13
 * @name schedulerService
 * @description Service layer for scheduler update operations using UTC payloads.
 */

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const updateSchedulerExecutionTime = async (
  input: SchedulerTimeUpdateInput
): Promise<SchedulerTimeUpdateResponse> => {
  return handleRequest(
    axiosInstance.patch("/user/schedulers/update-time", {
      schedulerId: input.schedulerId,
      scheduledAtUtc: input.scheduledAtUtc,
    })
  );
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================
export const useUpdateSchedulerExecutionTime = () => {
  return useMutation({
    mutationFn: updateSchedulerExecutionTime,
  });
};
