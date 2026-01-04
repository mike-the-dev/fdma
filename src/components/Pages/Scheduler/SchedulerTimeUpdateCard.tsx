"use client";

import type { ParsedScheduleTime } from "@/features/scheduler/_shared/scheduler.schema";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Calendar } from "@heroui/calendar";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

import { useSchedulerTimeUpdate } from "@/features/scheduler/update/useSchedulerTimeUpdate";

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-13
 * @name SchedulerTimeUpdateCard
 * @description UI card for selecting and updating a scheduler payout time.
 
*/
interface SchedulerTimeUpdateCardProps {
  schedulerId: string;
  currentSchedule: ParsedScheduleTime | null;
};

export const SchedulerTimeUpdateCard = (
  props: SchedulerTimeUpdateCardProps
): React.ReactElement => {
  const { schedulerId, currentSchedule } = props;
  const {
    currentScheduleLabel,
    isSaveDisabled,
    isSaving,
    selectedDate,
    setSelectedDate,
    timeError,
    timeValue,
    setTimeValue,
    handleSave,
  } = useSchedulerTimeUpdate(schedulerId, currentSchedule);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Payout Schedule Time</h2>
          <p className="text-sm text-foreground-500">
            Select a new date and time for this payout to execute.
          </p>
          <p className="text-xs text-foreground-400 mt-1">
            Current scheduled time: {currentScheduleLabel}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <div className="flex justify-center lg:justify-start">
            <Calendar
              aria-label="Select payout date"
              color="primary"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          <div className="space-y-4">
            <Input
              errorMessage={timeError ?? undefined}
              isInvalid={!!timeError}
              label="Payout time"
              type="time"
              value={timeValue}
              onChange={(event) => setTimeValue(event.target.value)}
            />
            <div className="rounded-md bg-default-100/70 p-3 text-sm text-foreground-600">
              <div className="flex items-center gap-2">
                <Icon className="text-primary" icon="lucide:calendar-clock" />
                <span>
                  New scheduled time: {selectedDate.toString()}{" "}
                  {timeValue || "--:--"}
                </span>
              </div>
            </div>
            <Button
              color="primary"
              isDisabled={isSaveDisabled}
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save Schedule Time"}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
