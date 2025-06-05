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
const HistoryItem = (props: HistoryItemProps) => {
  const { image, name, type, price, timestamp, currency, id } = props;

  const date = new Date(timestamp * 1000);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = `'${String(date.getFullYear()).slice(-2)}`;

  const formattedDate = `${day} ${month} ${year}`;

  return (
    <Link
      to={APP_ROUTES.ITEM_DETAILS + "/" + id}
      className="flex h-[68px] w-full items-center"
      viewTransition
    >
      <img
        src={image}
        className="h-[60px] rounded-[12px] aspect-square mr-[12px]"
      />
      <div className="flex-1 flex flex-col items-start justify-center">
        <p className="text-[12px] font-[600] leading-[14px] text-[rgba(255, 255, 255, 0.5)]">
          {type}
        </p>
        <p className="text-[17px] font-[600] leading-[24px] text-foreground">
          {name}
        </p>
      </div>
      <div className="flex flex-col items-end justify-center">
        <p className="text-[12px] font-[600] leading-[14px] text-[rgba(255, 255, 255, 0.5)]">
          {formattedDate}
        </p>
        <p className="text-[17px] font-[600] leading-[24px] text-foreground text-right">
          {formatWithThousandDots(price)} {currency}
        </p>
      </div>
    </Link>
  );
};

export default HistoryItem;
