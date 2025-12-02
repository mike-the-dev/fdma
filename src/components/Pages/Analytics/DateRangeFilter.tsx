import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";

interface DateRangeFilterProps {
  value: {
    start: Date;
    end: Date;
  };
  onChange: (range: { start: Date; end: Date }) => void;
};

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePresetSelect = (key: string) => {
    let end = new Date();
    let start = new Date();

    switch (key) {
      case "today":
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case "last7days":
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        break;
      case "last30days":
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        break;
      case "thisMonth":
        start = new Date(end.getFullYear(), end.getMonth(), 1);
        break;
      case "lastMonth":
        start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
        end = new Date(end.getFullYear(), end.getMonth(), 0);
        break;
      case "last3months":
        start = new Date(end.getFullYear(), end.getMonth() - 3, end.getDate());
        break;
      case "last6months":
        start = new Date(end.getFullYear(), end.getMonth() - 6, end.getDate());
        break;
      case "ytd":
        start = new Date(end.getFullYear(), 0, 1);
        break;
      default:
        break;
    }

    onChange({ start, end });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="flat"
          color="default"
          startContent={<Icon icon="lucide:calendar" />}
          endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
          className="min-w-[200px]"
        >
          {formatDate(value.start)} - {formatDate(value.end)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Date range options"
        onAction={(key) => handlePresetSelect(key as string)}
        className="min-w-[200px]"
      >
        <DropdownItem key="today">Today</DropdownItem>
        <DropdownItem key="yesterday">Yesterday</DropdownItem>
        <DropdownItem key="last7days">Last 7 days</DropdownItem>
        <DropdownItem key="last30days">Last 30 days</DropdownItem>
        <DropdownItem key="thisMonth">This month</DropdownItem>
        <DropdownItem key="lastMonth">Last month</DropdownItem>
        <DropdownItem key="last3months">Last 3 months</DropdownItem>
        <DropdownItem key="last6months">Last 6 months</DropdownItem>
        <DropdownItem key="ytd">Year to date</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};