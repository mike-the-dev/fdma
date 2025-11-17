import React from "react";
import { Service } from "@/types/service";
import { useForm } from "@tanstack/react-form";

/**
 * Form data structure for instant checkout creation
 */
export type InstantCheckoutServiceFormData = {
  name: string;
  price: string;
  description: string;
  slug: string;
};

/**
 * Form data structure for instant checkout editing
 * Includes the service ID in the form state
 */
export type InstantCheckoutServiceEditFormData = {
  id: string;
  name: string;
  price: string;
  description: string;
  slug: string;
};

/**
 * Payload sent to the API to create an instant checkout service
 * Intentionally limited to the four allowed fields
 */
export type InstantCheckoutServiceCreatePayload = {
  name: string;
  price: string;
  description: string;
  slug: string;
};

/**
 * Payload sent to the API to update an instant checkout service
 * Includes the service ID along with the updateable fields
 */
export type InstantCheckoutServiceUpdatePayload = {
  id: string;
  name: string;
  price: string;
  description: string;
  slug: string;
};

/**
 * Error state for instant checkout form validation
 */
export type InstantCheckoutServiceFormErrors = {
  name?: string;
  price?: string;
  description?: string;
  slug?: string;
  [key: string]: string | undefined;
};

/**
 * API response after creating an instant checkout service
 */
export type InstantCheckoutServiceResponse = Service;

/**
 * Extended service type with instant checkout specific fields
 */
export type InstantCheckoutService = Service & {
  isInstantCheckout?: boolean;
  affirmEnabled?: boolean;
};

/**
 * Result type for creating an instant checkout service
 */
export type CreateInstantCheckoutResult = { slug: string };

/**
 * Field validator structure for TanStack React Form
 */
export type FieldValidator = {
  onChange: ({ value }: { value: string }) => string | undefined;
};

/**
 * Validators object for instant checkout form fields
 */
export type InstantCheckoutFormValidators = {
  name: FieldValidator;
  price: FieldValidator;
  description: FieldValidator;
  slug: FieldValidator;
};

/**
 * Return type for useInstantCheckoutForm hook
 * Generic to support both create and edit forms
 */
export type UseInstantCheckoutFormReturn<T extends InstantCheckoutServiceFormData | InstantCheckoutServiceEditFormData = InstantCheckoutServiceFormData> = {
  form: ReturnType<typeof useForm<T>>;
  isPending: boolean;
  error: string | null;
  serviceLink: string;
  isSuccessOpen: boolean;
  onSuccessOpenChange: (isOpen: boolean) => void;
  validators: InstantCheckoutFormValidators;
  handleSlugChange: (value: string, onChange: (value: string) => void) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  serviceTitleInputRef: React.RefObject<HTMLInputElement>;
  hasChanges?: boolean;
};

