import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import {
  AccountAnalyticsTargets,
  FeatureAccount,
} from "./_shared/customerInsights.schema";

import axiosInstance, { BASE_URL } from "@/utils/axiosInterceptor";
import { handleRequest, getClientDomainHeader } from "@/services/api";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const postAnalyticsTargets = async (
  accountId: string,
  payload: AccountAnalyticsTargets
): Promise<{ success: boolean }> => {
  return handleRequest(
    axiosInstance.post(
      `/superadmin/account/${encodeURIComponent(accountId)}/analytics-targets`,
      payload
    )
  );
};

export const fetchAccount = async (accountId: string): Promise<any> => {
  return handleRequest(
    axiosInstance.get(`/user/account/${encodeURIComponent(accountId)}`)
  );
};

export const fetchAccounts = async (): Promise<FeatureAccount[]> => {
  return handleRequest(axiosInstance.get(`/user/listAccounts`));
};

// ============================================================================
// Server-side Fetch Functions
// ============================================================================
export const fetchAccountsServer = async (
  cookies: ReadonlyRequestCookies
): Promise<FeatureAccount[] | null> => {
  const accessToken = cookies.get("instapaytient_access_token")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(
      `${BASE_URL}/user/listAccounts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...getClientDomainHeader(),
        },
        next: {
          revalidate: 60,
          tags: ["accounts"],
        },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    return data as FeatureAccount[];
  } catch {
    return null;
  }
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================
export const useUpdateAnalyticsTargets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      data,
    }: {
      accountId: string;
      data: AccountAnalyticsTargets;
    }) => postAnalyticsTargets(accountId, data),
    onSuccess: async (_data, variables) => {
      // Invalidate both the single account and the accounts list
      queryClient.invalidateQueries({
        queryKey: ["account", variables.accountId],
      });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      // Revalidate server-side cache
      const { revalidateAccountsCache } = await import(
        "@/app/_actions/revalidateAccounts"
      );

      await revalidateAccountsCache();
    },
  });
};

export const useAccount = (accountId?: string) => {
  return useQuery({
    queryKey: ["account", accountId],
    queryFn: () => fetchAccount(accountId as string),
    enabled: !!accountId,
  });
};

export const useAccounts = () => {
  return useQuery<FeatureAccount[], Error>({
    queryKey: ["accounts"],
    queryFn: () => fetchAccounts(),
  });
};

// ============================================================================
// Server-side Prefetch
// ============================================================================
export const prefetchAccounts = async (
  cookies: ReadonlyRequestCookies
): Promise<DehydratedState> => {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery<FeatureAccount[] | null>({
    queryKey: ["accounts"],
    queryFn: () => fetchAccountsServer(cookies),
  });

  return dehydrate(queryClient);
};
