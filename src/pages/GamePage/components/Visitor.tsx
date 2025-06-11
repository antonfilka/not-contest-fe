import React, { useCallback } from "react";
import VisitorImg from "@/assets/game/visitor.png";
import { ProductImages, ProductType } from "./Products";
import { useNotcoinGameStore } from "@/store/gameStore";
import useHaptic from "@/hooks/useHaptic";

interface VisitorProps {
  id: number;
  type: ProductType;
}

const Visitor = (props: VisitorProps) => {
  const { type, id } = props;

  const { lightHaptic } = useHaptic();

  const giveItemToCustomer = useNotcoinGameStore((s) => s.giveItemToCustomer);

  const handleClick = useCallback(() => {
    // lightHaptic();
    giveItemToCustomer(id);
  }, [id]);

  return (
    <div
      className="relative min-w-[154px] w-[154px] h-[300px]  flex items-center justify-center"
      onClick={handleClick}
    >
      <img
        src={ProductImages[type]}
        alt="product"
        className="absolute z-[5] w-[130px] "
      />
      <img src={VisitorImg} alt="visitor" className="absolute h-full z-[3]" />
    </div>
  );
};

export default Visitor;
