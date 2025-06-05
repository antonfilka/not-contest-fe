import IconButton from "@/components/IconButton";
import { formatWithThousandDots } from "@/lib/utils";
import React from "react";

interface CartItemProps {
  id: number;
  image: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  quantity: number;
  onDecrementClick: (id: number) => void;
}

const CartItem = (props: CartItemProps) => {
  const { id, image, name, type, price, currency, onDecrementClick, quantity } =
    props;

  return (
    <div className="flex h-[68px] w-full items-center">
      <img
        src={image}
        className="h-[60px] rounded-[12px] aspect-square mr-[12px]"
      />
      <div className="flex-1 flex flex-col items-start justify-center">
        <p className="text-[12px] font-[600] leading-[14px] text-foreground opacity-50">
          {type}
        </p>
        <p className="text-[17px] font-[600] leading-[24px] text-foreground">
          {name}
        </p>
      </div>
      <div className="flex items-center justify-end gap-[12px]">
        <div className="flex-1 flex flex-col items-end justify-center">
          <p className="text-[17px] font-[400] leading-[22px] text-foreground">
            {formatWithThousandDots(price)} {currency}
          </p>
          <p className="text-[10px] font-[600] leading-[12px] text-foreground opacity-50 mr-[2px]">
            X {quantity || ""}
          </p>
        </div>

        <IconButton icon="remove" onClick={() => onDecrementClick(id)} />
      </div>
    </div>
  );
};

export default CartItem;
