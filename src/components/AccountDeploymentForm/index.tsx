"use client";
import { Card } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import {
  accountDeploymentSchema,
  AccountDeploymentFormData,
} from "../../schemas/accountDeployment";

import apiClient from "@/utils/apiClient";

// Remove the old State interface since we're using Zod schema now

const US_STATES = [
  { key: "AL", label: "Alabama" },
  { key: "AK", label: "Alaska" },
  { key: "AZ", label: "Arizona" },
  { key: "AR", label: "Arkansas" },
  { key: "CA", label: "California" },
  { key: "CO", label: "Colorado" },
  { key: "CT", label: "Connecticut" },
  { key: "DE", label: "Delaware" },
  { key: "FL", label: "Florida" },
  { key: "GA", label: "Georgia" },
  { key: "HI", label: "Hawaii" },
  { key: "ID", label: "Idaho" },
  { key: "IL", label: "Illinois" },
  { key: "IN", label: "Indiana" },
  { key: "IA", label: "Iowa" },
  { key: "KS", label: "Kansas" },
  { key: "KY", label: "Kentucky" },
  { key: "LA", label: "Louisiana" },
  { key: "ME", label: "Maine" },
  { key: "MD", label: "Maryland" },
  { key: "MA", label: "Massachusetts" },
  { key: "MI", label: "Michigan" },
  { key: "MN", label: "Minnesota" },
  { key: "MS", label: "Mississippi" },
  { key: "MO", label: "Missouri" },
  { key: "MT", label: "Montana" },
  { key: "NE", label: "Nebraska" },
  { key: "NV", label: "Nevada" },
  { key: "NH", label: "New Hampshire" },
  { key: "NJ", label: "New Jersey" },
  { key: "NM", label: "New Mexico" },
  { key: "NY", label: "New York" },
  { key: "NC", label: "North Carolina" },
  { key: "ND", label: "North Dakota" },
  { key: "OH", label: "Ohio" },
  { key: "OK", label: "Oklahoma" },
  { key: "OR", label: "Oregon" },
  { key: "PA", label: "Pennsylvania" },
  { key: "RI", label: "Rhode Island" },
  { key: "SC", label: "South Carolina" },
  { key: "SD", label: "South Dakota" },
  { key: "TN", label: "Tennessee" },
  { key: "TX", label: "Texas" },
  { key: "UT", label: "Utah" },
  { key: "VT", label: "Vermont" },
  { key: "VA", label: "Virginia" },
  { key: "WA", label: "Washington" },
  { key: "WV", label: "West Virginia" },
  { key: "WI", label: "Wisconsin" },
  { key: "WY", label: "Wyoming" },
];

const AccountDeploymentForm = (): React.ReactElement => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<AccountDeploymentFormData>({
    resolver: zodResolver(accountDeploymentSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      name: "",
      company: "",
      state: "",
      domain: "",
      stripeId: "",
    },
  });

  const deployAccount = async (
    deployAccountInput: AccountDeploymentFormData
  ): Promise<void> => {
    try {
      // Construct the full domain with prefix and suffix
      const fullDomain = `shop.${deployAccountInput.domain}.instapaytient.com`;

      // Create the payload with the complete domain
      const payload = {
        ...deployAccountInput,
        domain: fullDomain,
      };

      const response = await apiClient.post(
        "/api/user/createAccountDeployment",
        payload,
        { timeout: 20000 }
      );

      return response.data;
    } catch (error) {
      console.error("Error deploying account:", error);
      throw error;
    }
  };

  const onSubmitFormData = async (
    data: AccountDeploymentFormData
  ): Promise<void> => {
    try {
      await deployAccount(data);

      // Reset form on success
      reset({
        name: "",
        company: "",
        state: "",
        domain: "",
        stripeId: "",
      });

      // Show success toast
      addToast({
        title: "Account Deployed Successfully",
        description: `Account "${data.name}" has been deployed successfully!`,
        icon: <Icon icon="lucide:check-circle" width={24} />,
        severity: "success",
        timeout: 5000,
      });
    } catch (error: any) {
      console.error("Error deploying account: ", error);

      // If it's a token expiration error, don't show error message as user will be logged out
      if (error.isTokenExpired) {
        return;
      }

      // Show error toast
      addToast({
        title: "Deployment Failed",
        description: `Failed to deploy account "${data.name}". Please try again.`,
        icon: <Icon icon="lucide:alert-circle" width={24} />,
        severity: "danger",
        timeout: 5000,
      });
    }
  };

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Account Deployment</h3>
      <p>Deploy a new account with the required information.</p>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex-1">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                color={fieldState.error ? "danger" : "default"}
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="Name"
                placeholder="Enter name"
                type="text"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex-1">
          <Controller
            control={control}
            name="company"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                color={fieldState.error ? "danger" : "default"}
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="Company"
                placeholder="Enter company name"
                type="text"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex-1">
          <Controller
            control={control}
            name="state"
            render={({ field, fieldState }) => (
              <Select
                color={fieldState.error ? "danger" : "default"}
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="State"
                placeholder="Select a state"
                selectedKeys={field.value ? new Set([field.value]) : new Set()}
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys)[0] as
                    | string
                    | undefined;

                  field.onChange(selectedValue ?? "");
                }}
              >
                {US_STATES.map((state) => (
                  <SelectItem
                    key={state.key}
                  >{`${state.label} (${state.key})`}</SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        <div className="flex-1">
          <Controller
            control={control}
            name="domain"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                color={fieldState.error ? "danger" : "default"}
                endContent=".instapaytient.com"
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="Domain"
                placeholder="subdomain"
                startContent="shop."
                type="text"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex-1">
          <Controller
            control={control}
            name="stripeId"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                color={fieldState.error ? "danger" : "default"}
                errorMessage={fieldState.error?.message}
                isInvalid={!!fieldState.error}
                label="Stripe ID"
                placeholder="Enter Stripe ID"
                type="text"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <Spacer y={4} />
      <div>
        <Button
          color="primary"
          isDisabled={isSubmitting}
          variant="shadow"
          onPress={() => handleSubmit(onSubmitFormData)()}
        >
          {isSubmitting ? "Deploying..." : "Deploy Account"}
        </Button>
      </div>
    </Card>
  );
};

export default AccountDeploymentForm;
