"use client";

import React from "react";
import { formOptions, useForm } from "@tanstack/react-form";
import { useDisclosure } from "@heroui/react";
import { useCreateInstantService } from "./useCreateInstantService";
import { 
  InstantCheckoutServiceFormData, 
  UseInstantCheckoutFormReturn,
  InstantCheckoutFormValidators
} from "../_shared/instantService.schema";
import { mapInstantCheckoutFormData } from "../_shared/instantService.mappers";
import { validateName, validatePrice, validateDescription, validateSlug } from "../_shared/instantService.validators";
import { getOrigin } from "@/utils/getOrigin";
import { useRouter } from "next/navigation";

export const useCreateInstantServiceForm = (): UseInstantCheckoutFormReturn => {
  const service = useCreateInstantService();
  const [serviceLink, setServiceLink] = React.useState<string>("");
  const disclosure = useDisclosure();
  const serviceTitleInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const formOpts = formOptions<InstantCheckoutServiceFormData>({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      slug: "",
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      try {
        // Sanitize and map form data
        const sanitizedData = mapInstantCheckoutFormData(value);
        console.log("📦 Creating instant checkout service with data:", sanitizedData);
        
        const res = await service.createService(sanitizedData);
        console.log("✅ Service creation response:", res);

        if (res?.slug) {
          const link = `${getOrigin()}/shop/instant-service/${res.slug}`;
          setServiceLink(link);
          // Clear the form after successful creation
          form.reset();
          disclosure.onOpen();
        }
      } catch (error: any) {
        console.log("Form submission error: ", error);
      }
    },
  });

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

  // Handle success modal open/close: redirect to "/desk" when closed in any way
  const handleSuccessOpenChange = (isOpen: boolean): void => {
    disclosure.onOpenChange();
    if (!isOpen) {
      router.push("/desk");
    }
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

  // When error exists, it's always an Error from handleRequest
  const errorMessage = service.error;

  return {
    form: form,
    isPending: service.isPending,
    error: errorMessage,
    serviceLink: serviceLink,
    isSuccessOpen: disclosure.isOpen,
    onSuccessOpenChange: handleSuccessOpenChange,
    validators: validators,
    handleSlugChange: handleSlugChange,
    handleFormSubmit: handleFormSubmit,
    serviceTitleInputRef: serviceTitleInputRef,
  };
};

