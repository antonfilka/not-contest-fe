import axios from ".";
import { PurchaseHistoryResponse } from "../types/history";

export const fetchUserHistory = async () => {
  const res = await axios.get<PurchaseHistoryResponse>("history.json");
  return res.data.data;
};

export const fetchEmptyHistory = async () => {
  const res = await axios.get<PurchaseHistoryResponse>("no_history.json");
  return res.data.data;
};
