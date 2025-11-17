"use client";

import React from "react";
import { formOptions, useForm } from "@tanstack/react-form";
import { useDisclosure } from "@heroui/react";
import lodash from "lodash";
import { useUpdateInstantService } from "./useUpdateInstantService";
import { useGetInstantService } from "./useGetInstantService";
import { 
  InstantCheckoutServiceEditFormData, 
  UseInstantCheckoutFormReturn,
  InstantCheckoutFormValidators
} from "../_shared/instantService.schema";
import { mapInstantCheckoutFormDataForUpdate } from "../_shared/instantService.mappers";
import { validateName, validatePrice, validateDescription, validateSlug } from "../_shared/instantService.validators";
import { getOrigin } from "@/utils/getOrigin";
import { showSuccess } from "@/utils/toast";

export const useEditInstantServiceForm = (serviceId: string): UseInstantCheckoutFormReturn<InstantCheckoutServiceEditFormData> => {
  const { service } = useGetInstantService(serviceId);
  console.log("service: ", service);
  const updateService = useUpdateInstantService();
  const [serviceLink, setServiceLink] = React.useState<string>("");
  const disclosure = useDisclosure();
  const serviceTitleInputRef = React.useRef<HTMLInputElement>(null);

  // Map service data to form default values, including the service ID
  const initialValues: InstantCheckoutServiceEditFormData = React.useMemo(() => {
    return {
      id: serviceId,
      name: service?.name || "",
      price: service?.price || "",
      description: service?.description || "",
      slug: service?.slug || "",
    };
  }, [service, serviceId]);

  const formOpts = formOptions<InstantCheckoutServiceEditFormData>({
    defaultValues: initialValues,
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      try {
        // Sanitize and map form data, including the service ID from form state
        const sanitizedData = mapInstantCheckoutFormDataForUpdate(value);
        console.log("📦 Updating instant checkout service with payload:", sanitizedData);
        
        const res = await updateService.updateService(serviceId, sanitizedData);
        console.log("✅ Service update response:", res);

        if (res?.slug) {
          showSuccess("Service updated successfully", "Your instant service has been updated.");
          const link = `${getOrigin()}/shop/instant-service/${res.slug}`;
          setServiceLink(link);
          disclosure.onOpen();
        }
      } catch (error: any) {
        console.log("Form submission error: ", error);
      }
    },
  });

  // Update form values when service data is loaded
  React.useEffect(() => {
    if (service) {
      form.setFieldValue("id", serviceId);
      form.setFieldValue("name", service.name);
      form.setFieldValue("price", service.price);
      form.setFieldValue("description", service.description);
      form.setFieldValue("slug", service.slug);
    }
  }, [service, serviceId, form]);

  // Validators - all logic encapsulated in the hook
  const validators: InstantCheckoutFormValidators = {
    name: {
      onChange: ({ value }: { value: string }) => {
        const error = validateName(value);
        return error || undefined;
      },
    },
    price: {
      onChange: ({ value }: { value: string }) => {
        const error = validatePrice(value);
        return error || undefined;
      },
    },
    description: {
      onChange: ({ value }: { value: string }) => {
        const error = validateDescription(value);
        return error || undefined;
      },
    },
    slug: {
      onChange: ({ value }: { value: string }) => {
        const error = validateSlug(value);
        return error || undefined;
      },
    },
  };

  // Slug change handler with cleaning logic
  const handleSlugChange = (value: string, onChange: (value: string) => void): void => {
    const cleaned = value.replace(/\s/g, "");
    onChange(cleaned);
  };

  // Form submit handler
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  // Auto-focus on Service Title input field when component mounts
  React.useEffect(() => {
    // Small delay to ensure the input is rendered
    const timer = setTimeout(() => {
      // Try ref first, then fallback to querySelector
      const inputElement = serviceTitleInputRef.current || 
        (document.querySelector('input[name="name"]') as HTMLInputElement);
      
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const currentValues = form.useStore((state) => state.values);
  
  const hasChanges = React.useMemo(() => {
    return !lodash.isEqual(initialValues, currentValues);
  }, [initialValues, currentValues]);

  const errorMessage = updateService.error;

  return {
    form: form,
    isPending: updateService.isPending,
    error: errorMessage,
    serviceLink: serviceLink,
    isSuccessOpen: disclosure.isOpen,
    onSuccessOpenChange: disclosure.onOpenChange,
    validators: validators,
    handleSlugChange: handleSlugChange,
    handleFormSubmit: handleFormSubmit,
    serviceTitleInputRef: serviceTitleInputRef,
    hasChanges: hasChanges,
  };
};

