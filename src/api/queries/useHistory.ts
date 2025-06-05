import { useQuery } from "@tanstack/react-query";
import { fetchUserHistory, fetchEmptyHistory } from "../axios/history";
import { PurchaseRecord } from "../types/history";

export const useHistory = () =>
  useQuery<PurchaseRecord[]>({
    queryKey: ["purchaseHistory"],
    queryFn: async () => {
      try {
        return await fetchUserHistory();
      } catch {
        return await fetchEmptyHistory();
      }
    },
  });
