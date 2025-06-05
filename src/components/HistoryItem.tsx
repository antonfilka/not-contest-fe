import { useMemo } from "react";
import { APP_ROUTES } from "@/navigation/routes";
import { Link } from "./Link/Link";
import { formatWithThousandDots } from "@/lib/utils";

interface HistoryItemProps {
  id: number;
  image: string;
  name: string;
  type: string;
  currency: string;
  price: number;
  timestamp: number;
}

const HistoryItem = ({
  id,
  image,
  name,
  type,
  currency,
  price,
  timestamp,
}: HistoryItemProps) => {
  const formattedDate = useMemo(() => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = `'${String(date.getFullYear()).slice(-2)}`;
    return `${day} ${month} ${year}`;
  }, [timestamp]);

  const itemLink = `${APP_ROUTES.ITEM_DETAILS}/${id}`;

  return (
    <Link
      to={itemLink}
      className="flex h-[68px] w-full items-center"
      viewTransition
      aria-label={`Go to details for ${name}`}
    >
      <img
        src={image}
        alt={name}
        className="h-[60px] w-[60px] rounded-[12px] object-cover mr-[12px]"
      />

      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <p className="text-[12px] font-[600] leading-[14px] text-muted truncate">
          {type}
        </p>
        <p className="text-[17px] font-[600] leading-[24px] text-foreground truncate">
          {name}
        </p>
      </div>

      <div className="flex flex-col items-end justify-center text-right">
        <p className="text-[12px] font-[600] leading-[14px] text-muted">
          {formattedDate}
        </p>
        <p className="text-[17px] font-[600] leading-[24px] text-foreground">
          {formatWithThousandDots(price)} {currency}
        </p>
      </div>
    </Link>
  );
};

export default HistoryItem;
