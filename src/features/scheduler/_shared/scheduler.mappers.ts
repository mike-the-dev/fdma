import type { ParsedScheduleTime } from "./scheduler.schema";

import { CalendarDate } from "@heroui/calendar";
import { DateTime } from "luxon";

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-13
 * @name schedulerMappers
 * @description Mapping utilities for scheduler schedule expressions and local display formats.
 */
export const parseScheduleExpressionToLocal = (
  scheduleExpression?: string
): ParsedScheduleTime | null => {
  if (!scheduleExpression) { return null; };

  if (
    scheduleExpression.startsWith("rate(") ||
    scheduleExpression.startsWith("cron(")
  ) {
    return null;
  };

  const iso =
    scheduleExpression.startsWith("at(") &&
    scheduleExpression.endsWith(")")
      ? scheduleExpression.slice(3, -1)
      : scheduleExpression;
  const dt = DateTime.fromISO(iso, { zone: "utc" });

  if (!dt.isValid) { return null; };

  const localTime = dt.toLocal();

  return {
    dateValue: new CalendarDate(
      localTime.year,
      localTime.month,
      localTime.day
    ),
    timeValue: localTime.toFormat("HH:mm"),
    display: localTime.toFormat("MMM dd, yyyy 'at' h:mm a"),
    raw: scheduleExpression,
  };
};
