import { useFetchInstantServiceBySlug } from "../instantService.service";
import { InstantCheckoutServiceResponse } from "../_shared/instantService.schema";

interface UseGetInstantServiceBySlugReturn {
  isPending: boolean;
  error: string | null;
  data: InstantCheckoutServiceResponse | undefined;
  service: InstantCheckoutServiceResponse | undefined;
}

export const useGetInstantServiceBySlug = (slug: string): UseGetInstantServiceBySlugReturn => {
  const { isPending, error, data } = useFetchInstantServiceBySlug(slug);

  // When error exists, it's always an Error from handleRequest
  const errorMessage = error?.message || null;

  return {
    isPending: isPending,
    error: errorMessage,
    data: data,
    service: data, // Alias for convenience
  };
};

