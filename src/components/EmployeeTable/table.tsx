"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Spacer } from "@heroui/spacer";

import { Employee } from "@/types/Employee";

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "stripeID",
    label: "STRIPEID",
  },
];

interface EmployeeTableProps {
  heading: string;
  employees: Employee[];
  updateSelectedID: (selectedID: string, isToggled: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = (
  props
): React.ReactElement => {
  const onSelectionChangeHandler = (event: any) => {
    const obj = {};

    // @ts-ignore
    Object.setPrototypeOf(obj, event);
    // @ts-ignore
    props.updateSelectedID(obj.anchorKey, event.size);
  };

  if (!props.employees || props.employees.length === 0) return <div>OHHHH</div>;

  return (
    <>
      <h3>{props.heading}</h3>
      <Spacer y={4} />
      <Table
        aria-label="Example table with dynamic content"
        color={"primary"}
        selectionMode="single"
        onSelectionChange={onSelectionChangeHandler}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={props.employees}>
          {(item) => (
            <TableRow key={item.PK}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default EmployeeTable;
