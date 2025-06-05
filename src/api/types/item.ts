import { WithResponse } from ".";

export interface ShopItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  left: number;
  tags: Record<string, string>;
  images: string[];
}

export type ShopItemResponse = WithResponse<ShopItem>;
