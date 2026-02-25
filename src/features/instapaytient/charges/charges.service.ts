import { useQuery } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";
import { handleRequest } from "@/services/api";

import {
  Charge,
  ChargeMappedDTO,
  ListChargesQuery,
  ListChargesResponse,
} from "./_shared/charges.types";
import { listChargesQuerySchema } from "./_shared/charges.schema";
import { mapCharge } from "./_shared/charges.mappers";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const fetchCharges = async (
  query: ListChargesQuery
): Promise<Charge[]> => {
  const payload = listChargesQuerySchema.parse(query);
  const response = await handleRequest<ListChargesResponse>(
    apiClient.get<ListChargesResponse>(
      `/api/user/charges?stripeAccount=${encodeURIComponent(payload.stripeAccount)}`
    )
  );

  return response;
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================
export const useCharges = (stripeAccount?: string) => {
  return useQuery<Charge[], Error, ChargeMappedDTO[]>({
    queryKey: ["charges", stripeAccount],
    queryFn: () => fetchCharges({ stripeAccount: stripeAccount as string }),
    enabled: !!stripeAccount,
    select: (charges: Charge[]): ChargeMappedDTO[] => charges.map(mapCharge),
  });
};
