import { InstantCheckoutServiceFormData, InstantCheckoutServiceFormErrors } from "./instantService.schema";

/**
 * Validates the slug format
 * @param slug - URL slug to validate
 * @returns Error message or empty string if valid
 */
export const validateSlug = (slug: string): string => {
  if (!slug || slug.trim().length < 2) {
    return "URL must be at least 2 characters.";
  }
  if (/\s/.test(slug)) {
    return "URL cannot contain spaces. Use hyphens instead (e.g., 'my-slug-url').";
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return "URL must be lowercase and use hyphens to separate words, like 'my-slug-url'. Numbers are allowed.";
  }
  return "";
};

/**
 * Validates the price
 * @param price - Price string to validate
 * @returns Error message or empty string if valid
 */
export const validatePrice = (price: string): string => {
  if (!price || price.trim().length === 0) {
    return "Price is required.";
  }
  const num = parseFloat(price);
  if (isNaN(num)) {
    return "Price must be a valid number.";
  }
  if (num < 0) {
    return "Price cannot be negative.";
  }
  return "";
};

/**
 * Validates the service name
 * @param name - Service name to validate
 * @returns Error message or empty string if valid
 */
export const validateName = (name: string): string => {
  if (!name || name.trim().length === 0) {
    return "Service title is required.";
  }
  if (name.trim().length < 3) {
    return "Service title must be at least 3 characters.";
  }
  return "";
};

/**
 * Validates the service description (optional but has max length if provided)
 * @param description - Service description to validate
 * @returns Error message or empty string if valid
 */
export const validateDescription = (description: string): string => {
  if (description && description.trim().length > 500) {
    return "Service description must be 500 characters or less.";
  }
  return "";
};

/**
 * Validates all form fields
 * @param data - Form data to validate
 * @returns Object containing validation errors
 */
export const validateInstantCheckoutForm = (
  data: InstantCheckoutServiceFormData
): InstantCheckoutServiceFormErrors => {
  const errors: InstantCheckoutServiceFormErrors = {};

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const priceError = validatePrice(data.price);
  if (priceError) errors.price = priceError;

  const descriptionError = validateDescription(data.description);
  if (descriptionError) errors.description = descriptionError;

  const slugError = validateSlug(data.slug);
  if (slugError) errors.slug = slugError;

  return errors;
};

