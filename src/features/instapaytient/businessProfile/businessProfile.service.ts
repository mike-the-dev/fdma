import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setStripeAccountMcc } from "../account/account.service";
import { StripeAccount } from "../account/account.schema";

export const useUpdateStripeAccountMcc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      mcc,
    }: {
      id: string;
      mcc: string;
    }) => setStripeAccountMcc(id, mcc),
    onSuccess: async (_data: StripeAccount, variables) => {
      // Invalidate the stripe account query
      queryClient.invalidateQueries({
        queryKey: ["stripeAccount", variables.id],
      });
    },
  });
};

