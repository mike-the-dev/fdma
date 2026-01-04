import type { DateValue } from "@heroui/calendar";

import type { Scheduler } from "@/types/Scheduler";

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-13
 * @name schedulerSchema
 * @description Shared scheduler types for update payloads and schedule parsing.
 */
export interface SchedulerTimeUpdateInput {
  schedulerId: string;
  scheduledAtUtc: string;
};

export interface SchedulerTimeUpdateResponse {
  message: string;
  schedulerId: string;
  scheduledAtUtc: string;
  scheduleExpression: string;
};

export interface ParsedScheduleTime {
  dateValue: DateValue;
  timeValue: string;
  display: string;
  raw: string;
};

export type SchedulerDetail = Scheduler;
