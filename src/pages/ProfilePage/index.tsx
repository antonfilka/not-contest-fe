import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Page } from "@/components/Page.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useHistory } from "@/api/queries/useHistory";
import HistoryItem from "@/pages/ProfilePage/components/HistoryItem";
import { useCatalogue } from "@/api/queries/useCatalogue";
import { Link } from "@/components/Link";
import { APP_ROUTES } from "@/navigation/routes";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAppStore } from "@/store/appStore";
import useHaptic from "@/hooks/useHaptic";
import useTelegram from "@/hooks/useTelegram";

export const ProfilePage: FC = () => {
  const hasCompletedPayments = useAppStore(
    (state) => state.hasCompletedPayments,
  );
  const { mediumHaptic, isHapticSupported } = useHaptic();

  const {
    data: historyData = [],
    isLoading: historyLoading,
    refetch,
  } = useHistory(!hasCompletedPayments);
  const { data: catalogData = [], isLoading: catalogLoading } = useCatalogue();

  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(true);

  const navigate = useNavigate();
  const listRef = useRef<any>(null);

  const combinedLoading = useMemo(
    () => historyLoading || catalogLoading,
    [historyLoading, catalogLoading],
  );

  const combinedData = useMemo(() => {
    return historyData.map((item) => {
      const found = catalogData.find((i) => i.id === item.id);
      return {
        ...item,
        type: found?.category || "category",
        image: found?.images[0] || "",
        name: found?.name || "item",
      };
    });
  }, [historyData, catalogData]);

  const { launchParams } = useTelegram();

  const lastHapticChunkRef = useRef(0);
  const HAPTIC_SCROLL_INTERVAL = 68;

  const handleScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    const currentChunk = Math.floor(scrollOffset / HAPTIC_SCROLL_INTERVAL);

    if (currentChunk !== lastHapticChunkRef.current) {
      mediumHaptic();
      lastHapticChunkRef.current = currentChunk;
    }

    // Top gradient
    setShowTopGradient(scrollOffset > 5);

    // Bottom gradient
    if (listRef.current) {
      const totalHeight = listRef.current.props.itemSize * combinedData.length;
      const visibleHeight = listRef.current.props.height;
      const remaining = totalHeight - visibleHeight - scrollOffset;

      setShowBottomGradient(remaining > 5);
    }
  };

  useEffect(() => {
    refetch();
  }, [hasCompletedPayments]);

  if (!launchParams) {
    navigate(APP_ROUTES.HOME);
  }

  return (
    <Page back={true} className="px-[16px]">
      <motion.div
        className="relative w-full flex flex-col h-full items-center"
        variants={{
          initial: { opacity: 0, y: 10, scale: 0.99 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 0, scale: 0.9 },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="min-h-[232px] flex flex-col items-center justify-center gap-[8px]">
          <Avatar className="size-[120px]">
            <AvatarImage src={launchParams.tgWebAppData?.user?.photo_url} />
            <AvatarFallback>
              <p className="text-[34px] font-[600]">
                {launchParams.tgWebAppData?.user?.first_name[0] || ""}
                {launchParams.tgWebAppData?.user?.last_name
                  ? launchParams.tgWebAppData?.user?.last_name[0]
                  : ""}
              </p>
            </AvatarFallback>
          </Avatar>
          <h1 className="text-[26px] text-foreground font-[600] leading-[32px]">
            {launchParams.tgWebAppData?.user?.first_name ||
              launchParams.tgWebAppData?.user?.username ||
              ""}
          </h1>
        </div>

        {combinedLoading && (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {combinedData.length === 0 && !combinedLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-[8px]">
            <p className="text-[26px] leading-[32px] text-foreground font-[600] text-center">
              No history yet
            </p>
            <Link
              to={APP_ROUTES.HOME}
              className="text-[17px] leading-[22px] font-[400] text-center text-black dark:text-white opacity-50"
              viewTransition
            >
              Let’s change that
            </Link>
          </div>
        )}

        {combinedData.length > 0 && !combinedLoading && (
          <>
            <div className="w-full min-h-[56px] flex items-center justify-start">
              <h3 className="text-[20px] leading-[24px] text-foreground font-[600]">
                History
              </h3>
            </div>
            <div className="relative w-full flex-1 flex flex-col gap-[8px] overflow-y-auto">
              {/* Top Gradient */}
              <div
                className={`pointer-events-none absolute top-0 left-0 w-full h-[32px] bg-gradient-to-b from-background to-transparent z-10 transition-opacity duration-300 ${
                  showTopGradient ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Bottom Gradient */}
              <div
                className={`pointer-events-none absolute bottom-0 left-0 w-full h-[32px] bg-gradient-to-t from-background to-transparent z-10 transition-opacity duration-300 ${
                  showBottomGradient ? "opacity-100" : "opacity-0"
                }`}
              />

              <AutoSizer>
                {({ height, width }) => (
                  <List
                    ref={listRef}
                    height={height}
                    width={width}
                    itemCount={combinedData.length}
                    itemSize={76}
                    itemData={combinedData}
                    onScroll={isHapticSupported ? handleScroll : undefined}
                  >
                    {({ index, style, data }) => {
                      const item = data[index];
                      return (
                        <div style={style} key={item.id + item.timestamp}>
                          <HistoryItem
                            id={item.id}
                            image={item.image}
                            name={item.name}
                            type={item.type}
                            price={item.total}
                            timestamp={item.timestamp}
                            currency={item.currency}
                          />
                        </div>
                      );
                    }}
                  </List>
                )}
              </AutoSizer>
            </div>
          </>
        )}
      </motion.div>
    </Page>
  );
};
