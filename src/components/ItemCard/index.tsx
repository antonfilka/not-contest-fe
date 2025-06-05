import { ShopItem } from "@/api/types/item";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./swiperPagination.css";
import { formatWithThousandDots } from "@/lib/utils";

interface ItemCardProps {
  data: ShopItem;
  isChecked?: boolean;
}

const ItemCard = (props: ItemCardProps) => {
  const { data, isChecked } = props;

  return (
    <>
      <Swiper
        spaceBetween={2}
        slidesPerView={1}
        modules={[Pagination, A11y]}
        className="relative aspect-square w-full rounded-[16px]"
        pagination={{
          type: "bullets",
          dynamicBullets: true,
        }}
      >
        {[...data.images].map((image) => (
          <SwiperSlide key={image}>
            <img
              src={image}
              className="w-full h-full object-cover rounded-[16px]"
            />
          </SwiperSlide>
        ))}
      </Swiper>

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
    </>
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
