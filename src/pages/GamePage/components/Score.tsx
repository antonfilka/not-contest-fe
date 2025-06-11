import { useNotcoinGameStore } from "@/store/gameStore";
import NumberFlow from "@number-flow/react";

const Score = () => {
  const score = useNotcoinGameStore((s) => s.score);

  return (
    <div className="flex w-[110px] items-center justify-between">
      <p className="text-[20px] text-white">Score:</p>
      <NumberFlow value={score} className="text-white font-[600] text-[32px]" />
    </div>
  );
};

export default Score;
