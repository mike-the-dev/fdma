import { useCreateInstantCheckoutService } from "../instantService.service";
import { showError } from "@/utils/toast";
import { InstantCheckoutServiceCreatePayload, InstantCheckoutServiceResponse } from "../_shared/instantService.schema";

interface UseCreateInstantServiceReturn {
  isPending: boolean;
  error: string | null;
  createService: (data: InstantCheckoutServiceCreatePayload) => Promise<InstantCheckoutServiceResponse | undefined>;
}

export const useCreateInstantService = (): UseCreateInstantServiceReturn => {
  const { isPending, error, mutateAsync } = useCreateInstantCheckoutService();

  const createService = async (data: InstantCheckoutServiceCreatePayload): Promise<InstantCheckoutServiceResponse | undefined> => {
    try {
      return await mutateAsync(data);
    } catch (err) {
      // Surface a toast for known slug/URL taken error
      const message = (err as any)?.message || "";
      const lower = String(message).toLowerCase();
      if (lower.includes("url is already taken") || (lower.includes("slug") && lower.includes("already"))) {
        showError("This URL is already taken. Please choose another.");
      }
      return undefined;
    }
  };

  // When error exists, it's always an Error from handleRequest
  const errorMessage = error?.message || null;

  return {
    isPending: isPending,
    error: errorMessage,
    createService: createService,
  };
};

