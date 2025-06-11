import React from "react";
import Timer from "./Timer";
import Score from "./Score";

const Header = () => {
  return (
    <div className="absolute pt-[25px] px-[30px] w-full h-[40px] flex items-center justify-between">
      <Score />
      <Timer />
    </div>
  );
};

export default Header;
