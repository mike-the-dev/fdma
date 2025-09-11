"use client";
import { Card, Spacer, Input, Button, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountDeploymentSchema, AccountDeploymentFormData } from "../../schemas/accountDeployment";
import axios from "axios";

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
  { key: "WY", label: "Wyoming" }
];

const AccountDeploymentForm = (): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<AccountDeploymentFormData>({
    resolver: zodResolver(accountDeploymentSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      name: "",
      company: "",
      state: "",
      domain: ""
    }
  });

  // Add a key to force re-render when form resets
  const [formKey, setFormKey] = useState(0);

  const watchedState = watch("state");

  const deployAccount = async (deployAccountInput: AccountDeploymentFormData): Promise<void> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/createAccountDeployment`,
        deployAccountInput,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error deploying account:", error);
      throw error;
    }
  };

  const onStateChange = (value: string): void => {
    setValue("state", value, { shouldValidate: true });
  };

  const onSubmitFormData = async (data: AccountDeploymentFormData): Promise<void> => {
    try {
      await deployAccount(data);
      
      // Reset form on success
      reset();
      setFormKey(prev => prev + 1); // Force re-render
      
      console.log("Account deployment successful:", data);
    } catch (error) {
      console.error("Error deploying account: ", error);
    }
  };

  return (
    <Card
      key={formKey}
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
            type="text" 
            label="Name" 
            placeholder="Enter name" 
            {...register("name")}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            color={errors.name ? "danger" : "default"}
          />
        </div>
        <div className="flex-1">
          <Input 
            type="text" 
            label="Company" 
            placeholder="Enter company name" 
            {...register("company")}
            isInvalid={!!errors.company}
            errorMessage={errors.company?.message}
            color={errors.company ? "danger" : "default"}
          />
        </div>
      </div>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex-1">
          <Select
            label="State"
            placeholder="Select a state"
            selectedKeys={watchedState ? [watchedState] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0] as string;
              if (selectedValue) {
                onStateChange(selectedValue);
              }
            }}
            isInvalid={!!errors.state}
            errorMessage={errors.state?.message}
            color={errors.state ? "danger" : "default"}
          >
            {US_STATES.map((state) => (
              <SelectItem key={state.key} value={state.key} textValue={`${state.label} (${state.key})`}>
                {state.label} ({state.key})
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <Input 
            type="text" 
            label="Domain" 
            placeholder="subdomain" 
            startContent="shop."
            endContent=".instapaytient.com"
            {...register("domain")}
            isInvalid={!!errors.domain}
            errorMessage={errors.domain?.message}
            color={errors.domain ? "danger" : "default"}
          />
        </div>
      </div>
      <Spacer y={4} />
      <div>
        <Button 
          color="primary" 
          variant="shadow" 
          isDisabled={isSubmitting} 
          onPress={() => handleSubmit(onSubmitFormData)()}
        >
          {isSubmitting ? "Deploying..." : "Deploy Account"}
        </Button>
      </div>
    </Card>
  );
};

export default AccountDeploymentForm;
