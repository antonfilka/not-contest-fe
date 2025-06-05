import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWithThousandDots(value: string | number): string {
  const num =
    typeof value === "number"
      ? value
      : parseFloat(value.replace(/[^\d.-]/g, ""));
  if (isNaN(num)) return "";

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
