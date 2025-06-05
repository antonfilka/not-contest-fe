import { WithResponse } from ".";

export interface PurchaseRecord {
  timestamp: number;
  id: number;
  total: number;
  currency: string;
}

export type PurchaseHistoryResponse = WithResponse<PurchaseRecord>;
