import axios from ".";
import { ShopItem, ShopItemResponse } from "../types/item";

export const fetchCatalogue = async (): Promise<ShopItem[]> => {
  const response = await axios.get<ShopItemResponse>("items.json");
  return response.data.data;
};
