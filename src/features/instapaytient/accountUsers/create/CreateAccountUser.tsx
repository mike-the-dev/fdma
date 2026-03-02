"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";

import { AccountUserRole } from "../_shared/accountUsers.types";

import { useAccountUserCreationForm } from "./useAccountUserCreationForm";

interface CreateAccountUserProps {
  accountId: string;
  onUserCreated?: () => Promise<void> | void;
}

const CreateAccountUser = ({
  accountId,
  onUserCreated,
}: CreateAccountUserProps): React.ReactElement => {
  const { form, validators, isPending, error, handleFormSubmit } =
    useAccountUserCreationForm(accountId, onUserCreated);

  const roleOptions: Array<{ key: AccountUserRole; label: string }> = [
    { key: "Administrator", label: "Administrator" },
    { key: "Developer", label: "Developer" },
    { key: "Marketing", label: "Marketing" },
  ];

  return (
    <div>
      <p className="text-foreground-500">
        Create a new account user for this instapaytient account.
      </p>

      <Spacer y={4} />

      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <div className="space-y-4">
          <form.Field name="emailAddress" validators={validators.emailAddress}>
            {(field: any) => (
              <Input
                label="Email Address"
                type="email"
                errorMessage={field.state.meta.errors[0]}
                isInvalid={!!field.state.meta.errors.length}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              />
            )}
          </form.Field>

          <form.Field name="password" validators={validators.password}>
            {(field: any) => (
              <Input
                label="Password"
                type="password"
                errorMessage={field.state.meta.errors[0]}
                isInvalid={!!field.state.meta.errors.length}
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              />
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field name="firstName" validators={validators.firstName}>
              {(field: any) => (
                <Input
                  label="First Name"
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>

            <form.Field name="lastName" validators={validators.lastName}>
              {(field: any) => (
                <Input
                  label="Last Name"
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>

          <form.Field name="role" validators={validators.role}>
            {(field: any) => (
              <div className="space-y-2">
                <p className="text-sm text-foreground-500">Role</p>
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="w-full justify-between" variant="bordered">
                      <span>{field.state.value || "Select role"}</span>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="User role"
                    onAction={(key) => field.handleChange(String(key))}
                  >
                    <DropdownSection title="Roles">
                      {roleOptions.map((option) => (
                        <DropdownItem key={option.key}>{option.label}</DropdownItem>
                      ))}
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
                {field.state.meta.errors[0] ? (
                  <p className="text-sm text-danger">{field.state.meta.errors[0]}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          <div>
            <Button color="primary" isDisabled={isPending} type="submit" variant="shadow">
              {isPending ? "Adding User..." : "Add User"}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <>
          <Spacer y={4} />
          <p className="text-sm text-danger">{error}</p>
        </>
      )}
    </div>
  );
};

export default CreateAccountUser;
