import useEmblaCarousel from "embla-carousel-react";
import { ShopItem } from "@/api/types/item";
import { formatWithThousandDots } from "@/lib/utils";
import { NavLink } from "react-router";
import { APP_ROUTES } from "@/navigation/routes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "../../../components/ui/badge";

interface ItemCardProps {
  data: ShopItem;
  isChecked?: boolean;
}

const ItemCard = (props: ItemCardProps) => {
  const { data, isChecked } = props;

  const isInStock = useMemo(() => !!data?.left && data?.left > 0, [data]);
  const fewInStock = useMemo(() => !!data?.left && data?.left < 10, [data]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <NavLink
      key={data.id}
      to={APP_ROUTES.ITEM_DETAILS + "/" + data.id}
      viewTransition
      className="relative flex flex-col items-center gap-[8px] w-full min-w-full"
    >
      {/* Tags */}
      <div className="absolute z-[10] top-[7px] left-[7px] flex items-center gap-[5px]">
        {!isInStock && (
          <Badge className="text-background bg-foreground">
            Out of Nothing
          </Badge>
        )}
        {fewInStock && (
          <Badge className="text-foreground bg-background">
            A few items left
          </Badge>
        )}
      </div>

      {/* Carousel */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[16px]"
        style={{ opacity: isInStock ? 1 : 0.5 }}
      >
        <div ref={emblaRef} className="overflow-hidden h-full w-full">
          <div className="flex h-full gap-[3px]">
            {data.images.map((image, index) => (
              <div key={image} className="min-w-0 flex-[0_0_100%] relative">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-[16px]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination bullets */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 flex gap-[6px] z-10">
          {data.images.map((_, index) => {
            const isActive = selectedIndex === index;
            const distanceFromActive = Math.abs(selectedIndex - index);

            let baseOpacity = isActive ? 1 : 0.5;
            if (distanceFromActive > 1) {
              baseOpacity = 0.3;
            }
            if (distanceFromActive > 2) {
              baseOpacity = 0.1;
            }
            if (distanceFromActive > 3) {
              return null;
            }

            return (
              <div
                key={index}
                className={`transition-all duration-300 origin-center ${
                  isActive
                    ? "w-[20px] h-[4px] rounded-full bg-white"
                    : "w-[4px] h-[4px] rounded-full"
                }`}
                style={{
                  opacity: baseOpacity,
                  backgroundColor: isActive ? "white" : "#9ca3af",
                }}
              />
            );
          })}
        </div>
      </div>

      {isChecked && (
        <CheckIcon className="absolute z-30 top-[8px] right-[8px] w-[22px] h-[22px]" />
      )}

      <div className="w-full flex flex-col items-start gap-[2px]">
        <h4 className="itemTitle text-[17px] font-[600] leading-[24px]">
          {data.name}
        </h4>
        <p className=" text-[14px] font-[400] leading-[20px]">
          {formatWithThousandDots(data.price)}{" "}
          <span className="text-foreground opacity-50">NOT</span>
        </p>
      </div>
    </NavLink>
  );
};

export default ItemCard;

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11Z"
      className="fill-foreground"
    />
    <path
      d="M9.56641 16.0371C9.25391 16.0371 8.98828 15.9023 8.76953 15.6328L5.73438 11.8945C5.64844 11.793 5.58594 11.6934 5.54688 11.5957C5.51172 11.498 5.49414 11.3965 5.49414 11.291C5.49414 11.0566 5.57227 10.8633 5.72852 10.7109C5.88477 10.5586 6.08203 10.4824 6.32031 10.4824C6.58984 10.4824 6.81641 10.5977 7 10.8281L9.54297 14.0508L14.5059 6.1875C14.6074 6.03125 14.7129 5.92188 14.8223 5.85938C14.9316 5.79297 15.0684 5.75977 15.2324 5.75977C15.4707 5.75977 15.666 5.83398 15.8184 5.98242C15.9707 6.13086 16.0469 6.32031 16.0469 6.55078C16.0469 6.64453 16.0312 6.73828 16 6.83203C15.9688 6.92578 15.9199 7.02344 15.8535 7.125L10.3691 15.6094C10.1816 15.8945 9.91406 16.0371 9.56641 16.0371Z"
      className="fill-background"
    />
  </svg>
);
