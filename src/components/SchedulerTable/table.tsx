"use client";

import React from "react";
import { Table as NextUITable, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import { DateTime } from "luxon";

const columns: {
  key: string;
  label: string;
}[] = [
  {
    key: "orderNumber",
    label: "ORDER NUMBER",
  },
  {
    key: "creationDate",
    label: "PAYOUT CREATED",
  },
  {
    key: "scheduleExpression",
    label: "PAYOUT TIME",
  },
  {
    key: "daysToPayout",
    label: "DAYS TO PAYOUT",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "platform",
    label: "PLATFORM",
  },
  {
    key: "cardType",
    label: "PAYMENT METHOD",
  }
];

interface TableProps {
  heading: string;
  schedules: any[];
};

const Table: React.FC<any> = (props: TableProps): React.ReactElement => {

  // Helper function to extract order ID from Target.Input JSON
  const extractOrderNumber = (schedule: any): string => {
    try {
      if (schedule.Target?.Input) {
        const inputData = JSON.parse(schedule.Target.Input);
        
        // Check for Ecwid structure: payload.data.orderId
        if (inputData.payload?.data?.orderId) {
          return `#${inputData.payload.data.orderId}`;
        }
        
        // Check for Instapaytient structure: payload.order_id
        if (inputData.payload?.order_id) {
          // Remove "O#" or "ORDER#" prefix if it exists, then add single hashtag
          const orderId = inputData.payload.order_id.replace(/^(O#|ORDER#)/, '');
          return `#${orderId}`;
        }
        
        return "N/A";
      }
      return "N/A";
    } catch (error) {
      console.error("Error parsing Target.Input:", error);
      return "N/A";
    }
  };

  // Helper function to extract platform from Target.Input JSON
  const extractPlatform = (schedule: any): string => {
    try {
      if (schedule.Target?.Input) {
        const inputData = JSON.parse(schedule.Target.Input);
        
        // Check for platform field at root level (Ecwid)
        if (inputData.platform) {
          return inputData.platform;
        }
        
        // Check for Instapaytient structure - look for specific fields that indicate Instapaytient
        if (inputData.payload?.payout_account_id || inputData.payload?.stripe_account_id) {
          return "instapaytient";
        }
        
        return "N/A";
      }
      return "N/A";
    } catch (error) {
      console.error("Error parsing Target.Input for platform:", error);
      return "N/A";
    }
  };

  // Helper function to extract payment method from Target.Input JSON
  const extractCardType = (schedule: any): string => {
    try {
      if (schedule.Target?.Input) {
        const inputData = JSON.parse(schedule.Target.Input);
        
        // Check for Instapaytient structure: payload.payment_method
        if (inputData.payload?.payment_method) {
          return inputData.payload.payment_method;
        }
        
        // Ecwid doesn't have payment method info, so return N/A
        return "N/A";
      }
      return "N/A";
    } catch (error) {
      console.error("Error parsing Target.Input for payment method:", error);
      return "N/A";
    }
  };

  // Helper function to format creation date
  const formatCreationDate = (dateString: string): string => {
    try {
      const dt = DateTime.fromISO(dateString, { zone: 'utc' });
      
      if (dt.isValid) {
        // Convert to local time and format the same way as payout time
        const localTime = dt.toLocal();
        return localTime.toFormat('MMM dd, yyyy \'at\' h:mm a');
      }
      
      return dateString;
    } catch (error) {
      console.error("Error formatting creation date:", error);
      return dateString;
    }
  };

  // Helper function to format schedule expression to local time
  const formatScheduleExpression = (scheduleExpression: string): string => {
    try {
      // Handle different schedule expression formats
      if (scheduleExpression.startsWith('at(') && scheduleExpression.endsWith(')')) {
        // Extract the date from "at(2025-09-17T13:04:01)" format
        const dateString = scheduleExpression.slice(3, -1);
        const dt = DateTime.fromISO(dateString, { zone: 'utc' });
        
        if (dt.isValid) {
          // Convert to local time and format nicely
          const localTime = dt.toLocal();
          return localTime.toFormat('MMM dd, yyyy \'at\' h:mm a');
        }
      } else if (scheduleExpression.startsWith('rate(') || scheduleExpression.startsWith('cron(')) {
        // For rate and cron expressions, return as-is for now
        return scheduleExpression;
      }
      
      // Fallback: try to parse as ISO date
      const dt = DateTime.fromISO(scheduleExpression, { zone: 'utc' });
      if (dt.isValid) {
        const localTime = dt.toLocal();
        return localTime.toFormat('MMM dd, yyyy \'at\' h:mm a');
      }
      
      return scheduleExpression;
    } catch (error) {
      console.error("Error formatting schedule expression:", error);
      return scheduleExpression;
    }
  };

  // Helper function to calculate days to payout
  const calculateDaysToPayout = (creationDate: string, scheduleExpression: string): string => {
    try {
      // Parse creation date
      const createdDt = DateTime.fromISO(creationDate, { zone: 'utc' });
      if (!createdDt.isValid) return "N/A";

      // Parse payout time from schedule expression
      let payoutDt: DateTime | null = null;
      
      if (scheduleExpression.startsWith('at(') && scheduleExpression.endsWith(')')) {
        const dateString = scheduleExpression.slice(3, -1);
        payoutDt = DateTime.fromISO(dateString, { zone: 'utc' });
      } else {
        payoutDt = DateTime.fromISO(scheduleExpression, { zone: 'utc' });
      }

      if (!payoutDt || !payoutDt.isValid) return "N/A";

      // Calculate difference in days
      const diff = payoutDt.diff(createdDt, 'days');
      const days = Math.round(diff.days);

      if (days === 0) return "Today";
      if (days === 1) return "1 day";
      if (days > 0) return `${days} days`;
      if (days < 0) return `${Math.abs(days)} days ago`;

      return "N/A";
    } catch (error) {
      console.error("Error calculating days to payout:", error);
      return "N/A";
    }
  };


  if (!props.schedules || props.schedules.length === 0) return <div>No Schedules</div>;

  return (
    <NextUITable 
      color={"default"}
      selectionMode={"single"}
      aria-label="Scheduler table with dynamic content"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={props.schedules}>
        {(item) => (
          <TableRow key={item.Name}>
            {
              (columnKey) => {
                if (columnKey === "orderNumber") return <TableCell>{extractOrderNumber(item)}</TableCell>
                
                if (columnKey === "creationDate") return <TableCell>{formatCreationDate(item.CreationDate || "")}</TableCell>
                
                if (columnKey === "scheduleExpression") return <TableCell>{formatScheduleExpression(item.ScheduleExpression || "N/A")}</TableCell>
                
                if (columnKey === "daysToPayout") return <TableCell>{calculateDaysToPayout(item.CreationDate || "", item.ScheduleExpression || "")}</TableCell>
                
                if (columnKey === "name") return <TableCell>{item.Name || "N/A"}</TableCell>
                
                if (columnKey === "platform") return <TableCell>{extractPlatform(item)}</TableCell>
                
                if (columnKey === "cardType") return <TableCell>{extractCardType(item)}</TableCell>

                return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              }
            }
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
}

export default Table;
