import React from "react";
import StandImg from "@/assets/game/stand.png";

const Stand = () => {
  return (
    <img
      src={StandImg}
      alt="stand"
      className="absolute right-[20px] top-[50%] w-[300px] select-none pointer-events-none opacity-40"
    ></img>
  );
};

export default Stand;
