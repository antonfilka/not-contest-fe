import { cn } from "@/lib/utils";
import {
  hideBackButton,
  onBackButtonClick,
  showBackButton,
} from "@telegram-apps/sdk-react";
import { type PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router";

export function Page({
  children,
  back = true,
  className,
}: PropsWithChildren<{
  // True if it is allowed to go back from this page.
  back?: boolean;
  className?: string;
}>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      showBackButton();
      return onBackButtonClick(() => {
        navigate(-1);
      });
    }
    hideBackButton();
  }, [back]);

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {children}
    </div>
  );
}
