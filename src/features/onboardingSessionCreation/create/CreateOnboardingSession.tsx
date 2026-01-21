"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";

import { useOnboardingSessionCreationForm } from "./useOnboardingSessionCreationForm";

const CreateOnboardingSession = (): React.ReactElement => {
  const {
    form,
    isPending,
    error,
    handleFormSubmit,
    session,
    validators,
  } = useOnboardingSessionCreationForm();

  const handleCopy = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Onboarding Session Creation</h3>
      <p>Create a new onboarding session link for a customer.</p>
      <Spacer y={4} />

      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="flex-1">
            <form.Field name="customerName" validators={validators.customerName}>
              {(field: any) => (
                <Input
                  label="Customer Name"
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>
        </div>

        <Spacer y={4} />

        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="flex-1">
            <form.Field name="companyName" validators={validators.companyName}>
              {(field: any) => (
                <Input
                  label="Company Name"
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>
        </div>

        <Spacer y={4} />

        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="flex-1">
            <form.Field name="email" validators={validators.email}>
              {(field: any) => (
                <Input
                  label="Email"
                  type="email"
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>
        </div>

        <Spacer y={4} />

        <div>
          <Button
            color="primary"
            isDisabled={isPending}
            type="submit"
            variant="shadow"
          >
            {isPending ? "Creating..." : "Create Session"}
          </Button>
        </div>
      </form>

      {error && (
        <>
          <Spacer y={4} />
          <p className="text-sm text-danger">{error}</p>
        </>
      )}

      {session && (
        <>
          <Spacer y={6} />
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground-500">Onboarding URL</p>
              <div className="flex items-center gap-2">
                <Input
                  isReadOnly
                  value={session.onboardingUrl}
                />
                <Tooltip content="Copy URL">
                  <Button
                    isIconOnly
                    variant="flat"
                    onPress={() => handleCopy(session.onboardingUrl)}
                  >
                    <Icon icon="lucide:copy" width={18} />
                  </Button>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[220px]">
                <p className="text-sm text-foreground-500">Session ID</p>
                <Input isReadOnly value={session.sessionId} />
              </div>
              <div className="flex-1 min-w-[220px]">
                <p className="text-sm text-foreground-500">Expires At</p>
                <Input isReadOnly value={session.expiresAt} />
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default CreateOnboardingSession;
