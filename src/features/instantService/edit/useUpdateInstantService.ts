import { useUpdateInstantCheckoutService } from "../instantService.service";
import { InstantCheckoutServiceUpdatePayload, InstantCheckoutServiceResponse } from "../_shared/instantService.schema";

interface UseUpdateInstantServiceReturn {
  isPending: boolean;
  error: string | null;
  updateService: (serviceId: string, data: InstantCheckoutServiceUpdatePayload) => Promise<InstantCheckoutServiceResponse | undefined>;
}

export const useUpdateInstantService = (): UseUpdateInstantServiceReturn => {
  const { isPending, error, mutateAsync } = useUpdateInstantCheckoutService();

  const updateService = async (serviceId: string, data: InstantCheckoutServiceUpdatePayload): Promise<InstantCheckoutServiceResponse | undefined> => {
    try {
      return await mutateAsync({ serviceId, data });
    } catch (err) {
      return undefined;
    }
  };

  // When error exists, it's always an Error from handleRequest
  const errorMessage = error?.message || null;

  return {
    isPending: isPending,
    error: errorMessage,
    updateService: updateService,
  };
};

