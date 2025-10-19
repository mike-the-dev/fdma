/**
 * Format a currency value (converts cents to dollars)
 */
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  // Convert cents to dollars by dividing by 100
  const dollarAmount = amount / 100;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(dollarAmount);
};

/**
 * Calculate platform fee: custom take rate + 2.9%
 * @param amount - Transaction amount in cents
 * @param customTakeRate - Custom take rate as percentage (e.g., 3 for 3%)
 * @returns Platform fee in cents
 */
export const calculatePlatformFee = (amount: number, customTakeRate: number): number => {
  // Custom take rate + 2.9% processing fee
  const customTakeFee = Math.round(amount * (customTakeRate / 100)); // Custom take rate
  const processingFee = Math.round(amount * 0.029); // 2.9%
  return customTakeFee + processingFee;
};

/**
 * Calculate payout amount after platform fees
 * @param amount - Transaction amount in cents
 * @param customTakeRate - Custom take rate as percentage
 * @returns Payout amount in cents
 */
export const calculatePayoutAmount = (amount: number, customTakeRate: number): number => {
  const platformFee = calculatePlatformFee(amount, customTakeRate);
  return amount - platformFee;
};

/**
 * Format a date string
 */
export const formatDate = (dateString: string, includeTime: boolean = false): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};


