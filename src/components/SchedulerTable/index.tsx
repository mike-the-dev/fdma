import React from "react";
import Table from "./table";

interface SchedulerTableProps {
  schedules: any
};

const SchedulerTable: React.FC<SchedulerTableProps> = (props): React.ReactElement => {
  return (
    <>
      <Table 
        heading="Schedules" 
        schedules={props.schedules}
      />
    </>
  );
}

export default SchedulerTable;
