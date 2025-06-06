import { useQuery } from "@tanstack/react-query";
import { fetchUserHistory, fetchEmptyHistory } from "../axios/history";
import { PurchaseRecord } from "../types/history";

export const useHistory = (loadEmpty = true) =>
  useQuery<PurchaseRecord[]>({
    queryKey: ["purchaseHistory"],
    queryFn: async () => {
      if (loadEmpty) {
        return await fetchEmptyHistory();
      } else {
        return await fetchUserHistory();
      }
    },
  });
