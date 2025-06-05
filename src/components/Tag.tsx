import React from "react";
import { Badge } from "./ui/badge";
import { isThemeParamsDark, useSignal } from "@telegram-apps/sdk-react";

interface TagProps {
  value: string;
}

const Tag = (props: TagProps) => {
  const { value } = props;

  const isDark = useSignal(isThemeParamsDark);

  const mainValue = value.split(" ")[0];
  const secondaryValue = value.split(" ")[1];

  return (
    <Badge variant={isDark ? "dark" : "light"}>
      <p style={{ color: isDark ? "white" : "black" }}>
        {mainValue}{" "}
        <span style={{ color: isDark ? "#FFFFFF80" : "#00000080" }}>
          {secondaryValue}
        </span>
      </p>
    </Badge>
  );
};

export default Tag;
