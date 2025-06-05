import { CartItem } from "@/store/cartStore";

export const getCartIsEmpty = (cart: CartItem[]) => {
  return cart.length === 0;
};

export const getTotalPrice = (cart: CartItem[]) => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};
