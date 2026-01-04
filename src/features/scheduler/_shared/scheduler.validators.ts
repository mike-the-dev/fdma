/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-13
 * @name schedulerValidators
 * @description Validation helpers for scheduler date and time inputs.
 */
export const validateScheduledTime = (value: string): string | null => {
  if (!value) { return "Time is required."; };

  if (!/^\d{2}:\d{2}$/.test(value)) {
    return "Time must be in HH:mm format.";
  };

  return null;
};

export const validateScheduledDate = (value: string): string | null => {
  if (!value) { return "Date is required."; };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Date must be in YYYY-MM-DD format.";
  };

  return null;
};
