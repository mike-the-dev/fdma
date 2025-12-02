import { useQuery, QueryClient, dehydrate, type DehydratedState } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import axiosInstance, { BASE_URL } from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";
import { analyticsKeys } from "./_shared/analytics.keys";
import { QueryCacheTime } from "@/types/QueryConfig";
import {
  SummaryMetricsResponse,
  PeriodComparisonResponse,
  PaymentMethodMixResponse,
  AccountSizeDistributionResponse,
  MerchantAccountsLeaderboardResponse,
  VolumeStabilityResponse,
  CashFlowTimingResponse,
  OperationalHealthResponse,
} from "./_shared/analytics.schema";

// ============================================================================
// Client-side fetch for summary metrics
// ============================================================================
export const fetchSummaryMetricsClient = async (from: string, to: string): Promise<SummaryMetricsResponse> => {
  return handleRequest<SummaryMetricsResponse>(
    axiosInstance.get("/analytics/payouts/summary-metrics", {
      params: {
        from: from,
        to: to,
      },
    })
  );
};

export const fetchPeriodComparisonClient = async (to: string): Promise<PeriodComparisonResponse> => {
  return handleRequest<PeriodComparisonResponse>(
    axiosInstance.get("/analytics/payouts/period-comparison", {
      params: {
        to: to,
      },
    })
  );
};

export const fetchPaymentMethodMixClient = async (
  from: string,
  to: string,
): Promise<PaymentMethodMixResponse> => {
  return handleRequest<PaymentMethodMixResponse>(
    axiosInstance.get("/analytics/payouts/payment-methods", {
      params: {
        from: from,
        to: to,
      },
    }),
  );
};

export const fetchAccountSizeDistributionClient = async (
  from: string,
  to: string,
): Promise<AccountSizeDistributionResponse> => {
  return handleRequest<AccountSizeDistributionResponse>(
    axiosInstance.get("/analytics/payouts/accounts/distribution", {
      params: {
        from: from,
        to: to,
      },
    }),
  );
};

export const fetchMerchantAccountsLeaderboardClient = async (
  from: string,
  to: string,
  limit: number = 10,
): Promise<MerchantAccountsLeaderboardResponse> => {
  return handleRequest<MerchantAccountsLeaderboardResponse>(
    axiosInstance.get("/analytics/payouts/accounts/leaderboard", {
      params: {
        from: from,
        to: to,
        limit: limit,
      },
    }),
  );
};

export const fetchVolumeStabilityClient = async (
  from: string,
  to: string,
): Promise<VolumeStabilityResponse> => {
  return handleRequest<VolumeStabilityResponse>(
    axiosInstance.get("/analytics/payouts/volume-stability", {
      params: {
        from: from,
        to: to,
      },
    }),
  );
};

export const fetchCashFlowTimingClient = async (
  from: string,
  to: string,
): Promise<CashFlowTimingResponse> => {
  return handleRequest<CashFlowTimingResponse>(
    axiosInstance.get("/analytics/payouts/cash-flow-timing", {
      params: {
        from: from,
        to: to,
      },
    }),
  );
};

export const fetchOperationalHealthClient = async (): Promise<OperationalHealthResponse> => {
  return handleRequest<OperationalHealthResponse>(
    axiosInstance.get("/analytics/payouts/health"),
  );
};

// ============================================================================
// Server-side fetch for summary metrics (SSR prefetch)
// ============================================================================
export const fetchSummaryMetricsServer = async (
  cookies: ReadonlyRequestCookies,
  from: string,
  to: string,
): Promise<SummaryMetricsResponse | null> => {
  const accessToken = cookies.get("instapaytient_access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/analytics/payouts/summary-metrics?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        next: {
          revalidate: QueryCacheTime.FiveMinutes,
          tags: ["analytics-summary-metrics"],
        },
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as SummaryMetricsResponse;
  } catch (error) {
    console.error("Failed to fetch summary metrics via server-side fetch:", error);
    return null;
  }
};

// ============================================================================
// TanStack Query - Server-side prefetch for summary metrics
// ============================================================================
export const prefetchSummaryMetrics = async (
  cookies: ReadonlyRequestCookies,
  from: string,
  to: string,
): Promise<DehydratedState> => {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery<SummaryMetricsResponse | null>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: analyticsKeys.summaryMetrics(from, to),
    queryFn: () => fetchSummaryMetricsServer(cookies, from, to),
  });

  return dehydrate(queryClient);
};

// ============================================================================
// TanStack Query Hook - client-side useSummaryMetrics
// ============================================================================
export const useSummaryMetrics = (from: string, to: string) => {
  return useQuery<SummaryMetricsResponse>({
    queryKey: analyticsKeys.summaryMetrics(from, to),
    queryFn: () => fetchSummaryMetricsClient(from, to),
  });
};

export const usePeriodComparison = (to: string) => {
  return useQuery<PeriodComparisonResponse>({
    queryKey: analyticsKeys.periodComparison(to),
    queryFn: () => fetchPeriodComparisonClient(to),
  });
};

export const usePaymentMethodMix = (from: string, to: string) => {
  return useQuery<PaymentMethodMixResponse>({
    queryKey: analyticsKeys.paymentMethodMix(from, to),
    queryFn: () => fetchPaymentMethodMixClient(from, to),
  });
};

export const useAccountSizeDistribution = (from: string, to: string) => {
  return useQuery<AccountSizeDistributionResponse>({
    queryKey: analyticsKeys.accountSizeDistribution(from, to),
    queryFn: () => fetchAccountSizeDistributionClient(from, to),
  });
};

export const useMerchantAccountsLeaderboard = (
  from: string,
  to: string,
  limit: number = 10,
) => {
  return useQuery<MerchantAccountsLeaderboardResponse>({
    queryKey: analyticsKeys.merchantLeaderboard(from, to),
    queryFn: () => fetchMerchantAccountsLeaderboardClient(from, to, limit),
  });
};

export const useVolumeStability = (from: string, to: string) => {
  return useQuery<VolumeStabilityResponse>({
    queryKey: analyticsKeys.volumeStability(from, to),
    queryFn: () => fetchVolumeStabilityClient(from, to),
  });
};

export const useCashFlowTiming = (from: string, to: string) => {
  return useQuery<CashFlowTimingResponse>({
    queryKey: analyticsKeys.cashFlowTiming(from, to),
    queryFn: () => fetchCashFlowTimingClient(from, to),
  });
};

export const useOperationalHealth = () => {
  return useQuery<OperationalHealthResponse>({
    queryKey: analyticsKeys.operationalHealth(),
    queryFn: () => fetchOperationalHealthClient(),
  });
};