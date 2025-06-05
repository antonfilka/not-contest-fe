import { useQuery } from "@tanstack/react-query";
import { fetchCatalogue } from "../axios/catalogue";
import { ShopItem } from "../types/item";

export const useCatalogue = () =>
  useQuery<ShopItem[]>({
    queryKey: ["catalogue"],
    queryFn: fetchCatalogue,
    staleTime: Infinity,
    retry: 1,
  });
