import { useNotcoinGameStore } from "@/store/gameStore";
import NumberFlow from "@number-flow/react";

const Timer = () => {
  const timeLeft = useNotcoinGameStore((s) => s.timeLeft);

  const isUrgent = timeLeft <= 3 && timeLeft >= 0;

  return (
    <div className="flex w-[145px] items-center justify-between gap-[10px]">
      <p className="text-[20px] text-white">Time left:</p>
      <NumberFlow
        value={timeLeft}
        className="text-white font-[600] text-[32px] transition-all duration-300 ease-in-out"
        style={{ scale: isUrgent ? 1.2 : 1 }}
      />
    </div>
  );
};

export default Timer;
