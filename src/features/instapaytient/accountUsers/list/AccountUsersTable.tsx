"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";

import { useAccountUsers, useDeleteAccountUser } from "../accountUsers.service";
import { AccountUserListItem } from "../_shared/accountUsers.types";

interface AccountUsersTableProps {
  accountId: string;
}

const formatDate = (value: string): string => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleString();
};

const renderRoleColor = (role: AccountUserListItem["role"]) => {
  if (role === "Administrator") return "primary" as const;
  if (role === "Developer") return "secondary" as const;
  return "warning" as const;
};

const AccountUsersTable = ({ accountId }: AccountUsersTableProps): React.ReactElement => {
  const { data: users = [], isLoading, error } = useAccountUsers(accountId);
  const deleteUserMutation = useDeleteAccountUser();

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      await deleteUserMutation.mutateAsync({ accountId, userId });
      addToast({
        title: "User Removed",
        description: "User deleted successfully.",
        icon: <Icon icon="lucide:trash-2" width={20} />,
        severity: "success",
        color: "success",
        timeout: 4000,
      });
    } catch (deleteError: any) {
      addToast({
        title: "Delete Failed",
        description: deleteError?.message || "Failed to delete user.",
        icon: <Icon icon="lucide:alert-circle" width={20} />,
        severity: "danger",
        color: "danger",
        timeout: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Spinner color="primary" size="lg" />
          <span className="ml-3 text-gray-500">Loading users...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Icon className="text-danger mr-3" icon="lucide:alert-circle" />
          <span className="text-danger">{error.message}</span>
        </div>
      </Card>
    );
  }

  if (!users.length) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Icon className="text-gray-400 mr-3" icon="lucide:users" />
          <span className="text-gray-500">No users found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible shadow-sm">
      <Table removeWrapper aria-label="Account users table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn>Updated</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>
        <TableBody items={users}>
          {(item: AccountUserListItem) => (
            <TableRow key={item.id}>
              <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
              <TableCell>{item.emailAddress}</TableCell>
              <TableCell>
                <Chip color={renderRoleColor(item.role)} size="sm" variant="flat">
                  {item.role}
                </Chip>
              </TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>{formatDate(item.lastUpdated)}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  {item.emailAddress.toLowerCase() !==
                  "michael@instapaytient.com" ? (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly color="danger" variant="light">
                          <Icon icon="lucide:trash-2" width={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="User actions" variant="faded">
                        <DropdownSection title="Actions">
                          <DropdownItem
                            key="confirm-delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Icon icon="lucide:trash-2" width={16} />}
                            isDisabled={deleteUserMutation.isPending}
                            onPress={() => handleDeleteUser(item.id)}
                          >
                            Confirm Delete
                          </DropdownItem>
                        </DropdownSection>
                      </DropdownMenu>
                    </Dropdown>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default AccountUsersTable;
