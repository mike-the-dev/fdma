import { useMutation, useQuery, useQueryClient, QueryClient, dehydrate, type DehydratedState } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";
import { QueryCacheTime } from "@/services/queryConfig";
import { InstantCheckoutServiceCreatePayload, InstantCheckoutServiceUpdatePayload, InstantCheckoutServiceResponse } from "./_shared/instantService.schema";
import { getCookieData } from "@/services/api";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { revalidateInstantService, revalidateInstantServiceBySlug } from "@/app/_actions/revalidateInstantService";
import { getClientDomain } from "@/utils/getClientDomain";

// ============================================================================
// Client-side API Call Functions (includes fetches and mutations)
// ============================================================================
export const createInstantCheckoutService = async (data: InstantCheckoutServiceCreatePayload): Promise<InstantCheckoutServiceResponse> => {
  return handleRequest<InstantCheckoutServiceResponse>(
    axiosInstance.post("/user/createInstantService", data, { 
      params: { accountId: getCookieData().accountID } 
    })
  );
};

export const updateInstantCheckoutService = async (serviceId: string, data: InstantCheckoutServiceUpdatePayload): Promise<InstantCheckoutServiceResponse> => {
  return handleRequest<InstantCheckoutServiceResponse>(
    axiosInstance.patch(`/user/updateInstantService/${encodeURIComponent(serviceId)}`, data)
  );
};

export const fetchInstantCheckoutServiceById = async (serviceId: string): Promise<InstantCheckoutServiceResponse> => {
  return handleRequest<InstantCheckoutServiceResponse>(
    axiosInstance.get(`/user/getInstantService/${encodeURIComponent(serviceId)}`)
  );
};

export const fetchInstantServiceBySlug = async (slug: string): Promise<InstantCheckoutServiceResponse> => {
  return handleRequest<InstantCheckoutServiceResponse>(
    axiosInstance.get(`/getInstantService/${encodeURIComponent(slug)}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "x-client-domain": process.env.NODE_ENV === "development"
          ? "localhost"
          : (typeof window !== "undefined" ? window.location.hostname : ""),
      },
    })
  );
};

// ============================================================================
// Server-side Fetch Function
// ============================================================================
export const fetchInstantCheckoutServiceByIdServer = async (
  cookies: ReadonlyRequestCookies,
  serviceId: string
): Promise<InstantCheckoutServiceResponse | null> => {
  const accessToken = cookies.get("instapaytient_access_token")?.value;

  if (!accessToken || !serviceId) {
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/getInstantService/${encodeURIComponent(serviceId)}`,
      {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      next: {
        revalidate: QueryCacheTime.FiveMinutes,
        tags: [`instant-checkout-service-${serviceId}`]
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    console.log("data: ", data);
    return data as InstantCheckoutServiceResponse;
  } catch (error) {
    console.error("Failed to fetch instant checkout service via server-side fetch:", error);
    return null;
  }
};

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-27
 * @name fetchInstantCheckoutServiceBySlugServer
 * @description Fetches an instant checkout service by slug from the public API endpoint (no authentication required).
 * @param slug The service slug to fetch.
 * @param domain Optional domain for the x-client-domain header. If not provided, uses getClientDomain().
 * @returns Promise resolving to the service object or null if fetch fails.
 */
export const fetchInstantServiceBySlugServer = async (
  slug: string,
  domain?: string
): Promise<InstantCheckoutServiceResponse | null> => {
  if (!slug) {
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/getInstantService/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-domain": domain ?? getClientDomain(),
        },
        next: {
          revalidate: QueryCacheTime.FiveMinutes,
          tags: [`instant-checkout-service-slug-${slug}`]
        },
      }
    );

    if (!res.ok) {
      let message = `Request failed [status: ${res.status}]`;

      try {
        const errorBody = await res.json();
        if (errorBody?.message) {
          message += ` - ${errorBody.message}`;
        }
      } catch (parseError) {
        message += " - (failed to parse error response)";
      }

      console.error(`🚨 [Public Instant Service Fetch] ${message}`);
      return null;
    }

    const data = await res.json();
    console.log("✅ [Public Instant Service Fetch fetchInstantServiceBySlugServer] Successfully retrieved instant service data.");
    return data as InstantCheckoutServiceResponse;
  } catch (error: any) {
    console.error("🚨 [Public Instant Service Fetch] Exception during request:", error);
    return null;
  }
};

// ============================================================================
// TanStack Query Hook (coupled with the API call)
// ============================================================================
export const useCreateInstantCheckoutService = () => {
  return useMutation({
    mutationFn: (data: InstantCheckoutServiceCreatePayload) => createInstantCheckoutService(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: () => {
      console.log("error");
    },
    onSuccess: (data, variables, context) => {
      console.log("success");
    },
    onSettled: async (data, error, context) => {
      console.log("settled");
      if (error) {
        console.log(error);
      } else {
        // Run invalidateQueries to update any state if needed.
        // await queryClient.invalidateQueries({ queryKey: [] })
      }
    }
  });
};

// ============================================================================
// TanStack Query Mutation Hook (coupled with the API call)
// ============================================================================
export const useUpdateInstantCheckoutService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: InstantCheckoutServiceUpdatePayload }) => updateInstantCheckoutService(serviceId, data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: () => {
      console.log("error");
    },
    onSuccess: async (data, variables) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["instant-checkout-service", variables.serviceId] });
      await revalidateInstantService(variables.serviceId);
      
      // Revalidate the slug-based tag for the customer-facing page
      if (data?.slug) {
        await revalidateInstantServiceBySlug(data.slug);
        console.log("♻️ Revalidated instant service slug:", data.slug);
      }
    },
    onSettled: async (data, error, context) => {
      console.log("settled");
      if (error) {
        console.log(error);
      }
    }
  });
};

// ============================================================================
// TanStack Query Hook for fetching by ID
// ============================================================================
export const useFetchInstantCheckoutServiceById = (serviceId: string) => {
  return useQuery<InstantCheckoutServiceResponse, Error>({
    queryKey: ["instant-checkout-service", serviceId],
    queryFn: () => fetchInstantCheckoutServiceById(serviceId),
    enabled: !!serviceId,
  });
};

// ============================================================================
// TanStack Query Hook for fetching by slug (Public)
// ============================================================================
export const useFetchInstantServiceBySlug = (slug: string) => {
  return useQuery<InstantCheckoutServiceResponse, Error>({
    queryKey: ["instant-checkout-service-slug", slug],
    queryFn: () => fetchInstantServiceBySlug(slug),
    enabled: !!slug,
  });
};

// ============================================================================
// Server-side Prefetch by id Function
// ============================================================================
export const prefetchInstantCheckoutServiceById = async (
  cookies: ReadonlyRequestCookies,
  serviceId: string
): Promise<DehydratedState> => {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery<InstantCheckoutServiceResponse | null>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["instant-checkout-service", serviceId],
    queryFn: () => fetchInstantCheckoutServiceByIdServer(cookies, serviceId),
  });

  return dehydrate(queryClient);
};

// ============================================================================
// Server-side Prefetch by slug Function (Public)
// ============================================================================
export const prefetchInstantServiceBySlug = async (
  slug: string,
  domain?: string
): Promise<DehydratedState> => {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery<InstantCheckoutServiceResponse | null>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["instant-checkout-service-slug", slug],
    queryFn: () => fetchInstantServiceBySlugServer(slug, domain),
  });

  return dehydrate(queryClient);
};

