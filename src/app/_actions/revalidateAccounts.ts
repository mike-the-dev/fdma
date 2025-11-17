"use server";

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * @author mike-the-dev
 * @editor mike-the-dev
 * @lastUpdated 2025-01-22
 * @name revalidateAccountsCache
 * @description Server action that revalidates accounts cache to ensure fresh data after mutations.
 * @param args: RevalidateAccountsArgs - Object containing optional path and redirect flag
 * @returns Promise<void>
 */
type RevalidateAccountsArgs = {
  nextUrl?: string; // e.g. "/dashboard/customer-insights"
  shouldRedirect?: boolean; // optional, defaults to false
};

export const revalidateAccountsCache = async (args: RevalidateAccountsArgs = {}): Promise<void> => {
  // Revalidate the "accounts" tag that matches fetchAccountsServer pattern
  revalidateTag("accounts");
  
  // Optionally revalidate a specific path if provided
  if (args.nextUrl) {
    revalidatePath(args.nextUrl);
  }
  
  // Note: We don't redirect here by default since this is typically called
  // after a mutation where we want to stay on the current page with fresh data
  // If redirect is needed, it should be handled by the calling code
};

