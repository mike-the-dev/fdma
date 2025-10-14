"use client";
import { Card } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AccountDeploymentFormData>({
    resolver: zodResolver(accountDeploymentSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      name: "",
      company: "",
      state: "",
      domain: "",
    },
  });

  // State for the Select component
  const [selectedState, setSelectedState] = useState(new Set<string>());

  const watchedState = watch("state");

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
        payload
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
      reset();
      setSelectedState(new Set()); // Reset Select component state

      // Show success toast
      toast.success(
        `✅ Account "${data.name}" has been deployed successfully!`,
        { duration: 4000 }
      );
    } catch (error: any) {
      console.error("Error deploying account: ", error);

      // If it's a token expiration error, don't show error message as user will be logged out
      if (error.isTokenExpired) {
        return;
      }

      // Show error toast
      toast.error(
        `❌ Failed to deploy account "${data.name}". Please try again.`,
        { duration: 4000 }
      );
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
          <Input
            label="Name"
            placeholder="Enter name"
            type="text"
            {...register("name")}
            color={errors.name ? "danger" : "default"}
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Company"
            placeholder="Enter company name"
            type="text"
            {...register("company")}
            color={errors.company ? "danger" : "default"}
            errorMessage={errors.company?.message}
            isInvalid={!!errors.company}
          />
        </div>
      </div>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex-1">
          <Select
            color={errors.state ? "danger" : "default"}
            errorMessage={errors.state?.message}
            isInvalid={!!errors.state}
            label="State"
            placeholder="Select a state"
            selectedKeys={selectedState}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0] as string;
              setSelectedState(keys as Set<string>);
              setValue("state", selectedValue, { shouldValidate: true });
            }}
          >
            {US_STATES.map((state) => (
              <SelectItem key={state.key}>{`${state.label} (${state.key})`}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <Input
            endContent=".instapaytient.com"
            label="Domain"
            placeholder="subdomain"
            startContent="shop."
            type="text"
            {...register("domain")}
            color={errors.domain ? "danger" : "default"}
            errorMessage={errors.domain?.message}
            isInvalid={!!errors.domain}
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
