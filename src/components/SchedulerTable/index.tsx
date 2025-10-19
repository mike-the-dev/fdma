import React from "react";
import type { Scheduler } from "@/types/Scheduler";

import Table from "./table";

interface SchedulerTableProps {
  schedules: Scheduler[];
}

const SchedulerTable: React.FC<SchedulerTableProps> = (
  props
): React.ReactElement => {
  return (
    <>
      <Table heading="Schedules" schedules={props.schedules} />
    </>
  );
};

export default SchedulerTable;
