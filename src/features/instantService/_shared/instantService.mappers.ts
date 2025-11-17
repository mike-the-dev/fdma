import { InstantCheckoutServiceFormData, InstantCheckoutServiceEditFormData, InstantCheckoutServiceCreatePayload, InstantCheckoutServiceUpdatePayload } from "./instantService.schema";

/**
 * Transforms form data for API submission, limited to allowed fields
 * @param data - Raw form data
 * @returns Sanitized payload with only name, price, description, slug
 */
export const mapInstantCheckoutFormData = (
  data: InstantCheckoutServiceFormData
): InstantCheckoutServiceCreatePayload => {
  return {
    name: data.name.trim(),
    price: data.price.trim(),
    description: data.description.trim(),
    slug: data.slug.trim().toLowerCase(),
  };
};

/**
 * Transforms form data for API update submission, includes service ID
 * @param data - Raw form data with id included
 * @returns Sanitized payload with id, name, price, description, slug
 */
export const mapInstantCheckoutFormDataForUpdate = (
  data: InstantCheckoutServiceEditFormData
): InstantCheckoutServiceUpdatePayload => {
  return {
    id: data.id,
    name: data.name.trim(),
    price: data.price.trim(),
    description: data.description.trim(),
    slug: data.slug.trim().toLowerCase(),
  };
};

