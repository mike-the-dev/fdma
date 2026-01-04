"use client";

import type { DateValue } from "@heroui/calendar";

import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";
import { getLocalTimeZone, today } from "@internationalized/date";
import { DateTime } from "luxon";

import type { ParsedScheduleTime } from "../_shared/scheduler.schema";

import { parseScheduleExpressionToLocal } from "../_shared/scheduler.mappers";
import {
  validateScheduledDate,
  validateScheduledTime,
} from "../_shared/scheduler.validators";
import { useUpdateSchedulerExecutionTime } from "../scheduler.service";

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-13
 * @name useSchedulerTimeUpdate
 * @description Hook that manages scheduler time update state, validation, and UTC conversion.
 */

export interface UseSchedulerTimeUpdateReturn {
  currentScheduleLabel: string;
  isSaveDisabled: boolean;
  isSaving: boolean;
  selectedDate: DateValue;
  setSelectedDate: (value: DateValue) => void;
  timeError: string | null;
  timeValue: string;
  setTimeValue: (value: string) => void;
  handleSave: () => Promise<void>;
};

export const useSchedulerTimeUpdate = (
  schedulerId: string,
  currentSchedule: ParsedScheduleTime | null
): UseSchedulerTimeUpdateReturn => {
  const mutation = useUpdateSchedulerExecutionTime();
  const defaultDate = useMemo(() => today(getLocalTimeZone()), []);
  const [selectedDate, setSelectedDate] = useState<DateValue>(defaultDate);
  const [timeValue, setTimeValue] = useState<string>("");
  const [currentScheduleLocal, setCurrentScheduleLocal] =
    useState<ParsedScheduleTime | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  useEffect(() => {
    if (currentSchedule) {
      setCurrentScheduleLocal(currentSchedule);
      setSelectedDate(currentSchedule.dateValue);
      setTimeValue(currentSchedule.timeValue);
    };
  }, [currentSchedule]);

  useEffect(() => {
    setTimeError(validateScheduledTime(timeValue));
  }, [timeValue]);

  const isSaveDisabled = !timeValue || !!timeError || mutation.isPending;

  const handleSave = async (): Promise<void> => {
    const dateValue = selectedDate.toString();
    const dateError = validateScheduledDate(dateValue);

    if (dateError || timeError) {
      setTimeError(timeError ?? dateError ?? "Date and time are required.");
      return;
    };

    const [hour, minute] = timeValue.split(":").map((value) => Number(value));
    const localDateTime = DateTime.fromISO(dateValue, {
      zone: getLocalTimeZone(),
    }).set({ hour, minute, second: 0, millisecond: 0 });

    if (!localDateTime.isValid) {
      setTimeError("Invalid date/time selection.");
      return;
    };

    const scheduledAtUtc = localDateTime.toUTC().toISO();

    if (!scheduledAtUtc) {
      setTimeError("Unable to convert time to UTC.");
      return;
    };

    try {
      const response = await mutation.mutateAsync({
        schedulerId,
        scheduledAtUtc,
      });

      setCurrentScheduleLocal(
        parseScheduleExpressionToLocal(response.scheduleExpression)
      );

      addToast({
        title: "Schedule Updated",
        description: "The payout time has been updated for this scheduler.",
        icon: React.createElement(Icon, {
          icon: "lucide:check-circle",
          width: 24,
        }),
        severity: "success",
        color: "success",
        timeout: 5000,
      });
    } catch (error: any) {
      console.error("Error updating schedule time:", error);

      if (error.isTokenExpired) {
        return;
      };

      addToast({
        title: "Update Failed",
        description: "Failed to update the payout time. Please try again.",
        icon: React.createElement(Icon, {
          icon: "lucide:alert-circle",
          width: 24,
        }),
        severity: "danger",
        color: "danger",
        timeout: 5000,
      });
    }
  };

  const currentScheduleLabel = currentScheduleLocal
    ? currentScheduleLocal.display
    : "Not available";

  return {
    currentScheduleLabel,
    isSaveDisabled,
    isSaving: mutation.isPending,
    selectedDate,
    setSelectedDate,
    timeError,
    timeValue,
    setTimeValue,
    handleSave,
  };
};
