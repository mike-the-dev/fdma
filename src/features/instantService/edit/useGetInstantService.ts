import { useFetchInstantCheckoutServiceById } from "../instantService.service";
import { InstantCheckoutServiceResponse } from "../_shared/instantService.schema";

interface UseGetInstantServiceReturn {
  isPending: boolean;
  error: string | null;
  data: InstantCheckoutServiceResponse | undefined;
  service: InstantCheckoutServiceResponse | undefined;
}

export const useGetInstantService = (serviceId: string): UseGetInstantServiceReturn => {
  const { isPending, error, data } = useFetchInstantCheckoutServiceById(serviceId);

  // When error exists, it's always an Error from handleRequest
  const errorMessage = error?.message || null;

  return {
    isPending: isPending,
    error: errorMessage,
    data: data,
    service: data, // Alias for convenience
  };
};

